import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../lib/api";

export interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    console.log("AuthProvider initializing...");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            console.log("Checking authentication...");
            const token = localStorage.getItem("smart-recon-token");
            if (token) {
                try {
                    const response = await authAPI.getMe();
                    if (response.success) {
                        console.log("User authenticated:", response.data.user);
                        setUser(response.data.user);
                    }
                } catch (err) {
                    console.error("Auth check failed:", err);
                    localStorage.removeItem("smart-recon-token");
                    localStorage.removeItem("smart-recon-user");
                }
            } else {
                console.log("No token found");
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    interface AuthResponse {
        success: boolean;
        message?: string;
    }

    const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
        setError(null);
        try {
            const response = await authAPI.signup(name, email, password);

            if (response.success) {
                const { user: userData, token } = response.data;
                localStorage.setItem("smart-recon-token", token);
                localStorage.setItem("smart-recon-user", JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
            return { success: false, message: response.message || "Signup failed" };
        } catch (err: any) {
            console.error("Signup error:", err);
            const msg = err.response?.data?.message || err.message || "Signup failed";
            setError(msg);
            return { success: false, message: msg };
        }
    };

    const login = async (email: string, password: string): Promise<AuthResponse> => {
        setError(null);
        try {
            const response = await authAPI.login(email, password);

            if (response.success) {
                const { user: userData, token } = response.data;
                localStorage.setItem("smart-recon-token", token);
                localStorage.setItem("smart-recon-user", JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
            return { success: false, message: response.message || "Login failed" };
        } catch (err: any) {
            console.error("Login error:", err);
            const msg = err.response?.data?.message || err.message || "Login failed";
            setError(msg);
            return { success: false, message: msg };
        }
    };

    const logout = () => {
        console.log("Logging out...");
        setUser(null);
        localStorage.removeItem("smart-recon-token");
        localStorage.removeItem("smart-recon-user");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
