import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Shield } from "lucide-react";

export function SettingsView() {
    const { user, logout } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-text-main">Settings</h2>
                <p className="text-text-muted">Manage your account preferences.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft-xl p-6 max-w-2xl">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-main">{user?.name || "User"}</h3>
                        <p className="text-text-muted">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="text-primary" size={20} />
                            <div>
                                <p className="font-bold text-text-main">Account Security</p>
                                <p className="text-xs text-text-muted">Password and session management (Managed by Backend)</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 border-2 border-error/10 text-error font-bold rounded-xl hover:bg-error/5 transition-colors"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
