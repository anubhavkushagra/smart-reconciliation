import type { ReactNode } from "react";
import { Sidenav } from "./Sidenav";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
    children: ReactNode;
    currentView: "dashboard" | "reports" | "settings";
    onNavigate: (view: "dashboard" | "reports" | "settings") => void;
}

export function DashboardLayout({ children, currentView, onNavigate }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-background font-sans text-text-main antialiased selection:bg-primary selection:text-white">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
            <Sidenav currentView={currentView} onNavigate={onNavigate} />
            <main className="relative h-full max-h-screen transition-all duration-200 ease-soft-in-out xl:ml-68 rounded-xl ml-72">
                <Navbar />
                <div className="w-full px-6 py-6 mx-auto">
                    {children}

                    <footer className="pt-4 mt-8">
                        <div className="w-full px-6 mx-auto">
                            <div className="flex flex-wrap items-center -mx-3 lg:justify-between">
                                <div className="w-full max-w-full px-3 mt-0 mb-6 shrink-0 lg:mb-0 lg:w-1/2 lg:flex-none">
                                    <div className="text-sm leading-normal text-left text-text-muted">
                                        © 2026, Smart Reconciliation Visualizer
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
