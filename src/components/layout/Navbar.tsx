import { useState } from "react";
import { Bell, User, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "../AuthModal";

export function Navbar() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <>
            <nav className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start">
                <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
                    <nav>
                        <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
                            <li className="text-sm leading-normal">
                                <span className="opacity-50 text-text-muted">Pages</span>
                            </li>
                            <li className="text-sm leading-normal font-medium text-text-main pl-2 before:float-left before:pr-2 before:content-['/'] before:text-text-muted">
                                Dashboard
                            </li>
                        </ol>
                        <h6 className="mb-0 font-bold capitalize text-text-main">Dashboard</h6>
                    </nav>

                    <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
                        <div className="flex items-center md:ml-auto md:pr-4">
                            <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-soft">
                                {/* Search could go here */}
                            </div>
                        </div>
                        <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
                            <li className="flex items-center pl-4 xl:hidden">
                                <a href="#" className="block p-0 text-sm transition-all text-text-muted">
                                    <Menu size={20} />
                                </a>
                            </li>

                            {isAuthenticated ? (
                                <>
                                    <li className="flex items-center px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tl from-primary to-primary-hover flex items-center justify-center text-white font-bold text-sm">
                                                {user?.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <span className="hidden sm:inline text-sm font-semibold text-text-main">
                                                {user?.name}
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex items-center pr-4">
                                        <button
                                            onClick={logout}
                                            className="p-2 text-sm transition-all text-text-muted hover:text-error rounded-lg hover:bg-error/10"
                                            title="Logout"
                                        >
                                            <LogOut size={16} />
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="flex items-center px-4">
                                    <button
                                        onClick={() => setShowAuthModal(true)}
                                        className="px-4 py-2 text-sm font-semibold transition-all text-white bg-gradient-to-tl from-primary to-primary-hover rounded-lg shadow-soft-sm hover:shadow-soft-xl"
                                    >
                                        <User size={16} className="sm:mr-1 inline" />
                                        <span className="hidden sm:inline">Sign In</span>
                                    </button>
                                </li>
                            )}

                            <li className="flex items-center pr-4">
                                <a href="#" className="p-0 text-sm transition-all text-text-muted hover:text-primary">
                                    <Bell size={16} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
}
