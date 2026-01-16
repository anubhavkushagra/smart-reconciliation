import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Lock, User as UserIcon, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (mode === "signup") {
            const result = await signup(name, email, password);
            if (result.success) {
                onClose();
            } else {
                setError(result.message || "Signup failed");
            }
        } else {
            const result = await login(email, password);
            if (result.success) {
                onClose();
            } else {
                setError(result.message || "Invalid email or password");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-soft-xl p-8 w-full max-w-md relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold text-text-main mb-2">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-text-muted mb-6">
                        {mode === "login" ? "Sign in to access your saved reconciliations" : "Sign up to save and track your reconciliations"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "signup" && (
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-2">
                                    <UserIcon size={16} className="inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                <Mail size={16} className="inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                <Lock size={16} className="inline mr-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error px-4 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-tl from-primary to-primary-hover text-white rounded-lg shadow-soft-sm font-bold hover:shadow-soft-xl transition-all"
                        >
                            {mode === "login" ? "Sign In" : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-muted">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => {
                                setMode(mode === "login" ? "signup" : "login");
                                setError("");
                            }}
                            className="ml-2 text-primary font-semibold hover:underline"
                        >
                            {mode === "login" ? "Sign Up" : "Sign In"}
                        </button>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-center text-xs text-text-muted">
                        <Server size={12} className="mr-2 opacity-50" />
                        Connecting to: <code className="ml-1 bg-gray-100 px-1 rounded">{API_URL}</code>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
