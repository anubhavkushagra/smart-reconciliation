import { FileSpreadsheet, BarChart2, Settings, Box } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "dashboard" | "reports" | "settings";

interface SidenavProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

export function Sidenav({ currentView, onNavigate }: SidenavProps) {
    const navItems = [
        { id: "dashboard", icon: FileSpreadsheet, label: "Reconciliation" },
        { id: "reports", icon: BarChart2, label: "Reports" },
        { id: "settings", icon: Settings, label: "Settings" },
    ] as const;

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 m-4 overflow-y-auto bg-white border-0 shadow-soft-xl rounded-2xl">
            <div className="h-16 flex items-center px-8 border-b border-transparent">
                <Box className="w-6 h-6 text-primary mr-3" />
                <span className="font-bold text-text-main text-sm uppercase">Smart Reconcile</span>
            </div>

            <div className="p-4">
                <ul className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavigate(item.id as View)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                                        isActive
                                            ? "bg-white shadow-soft-sm text-text-main font-semibold"
                                            : "text-text-muted hover:text-text-main hover:bg-gray-50"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "p-2 rounded-lg shadow-soft-sm grid place-items-center transition-colors",
                                            isActive
                                                ? "bg-gradient-to-tl from-primary to-primary-hover text-white shadow-md"
                                                : "bg-white text-text-main"
                                        )}
                                    >
                                        <item.icon size={16} />
                                    </div>
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
                <div className="p-4 rounded-xl bg-gradient-to-tl from-secondary to-gray-400 overflow-hidden relative">
                    <div className="relative z-10 text-white">
                        <h6 className="font-bold text-sm mb-1">Need Help?</h6>
                        <p className="text-xs opacity-80 mb-2">Check our docs</p>
                        <button className="w-full py-2 bg-white text-text-main text-xs font-bold rounded-lg shadow-soft-sm hover:shadow-md transition-shadow">
                            Documentation
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
