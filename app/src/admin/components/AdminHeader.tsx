import { Menu, Bell, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
    title: string;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export function AdminHeader({ title, onMenuClick, showMenuButton = false }: AdminHeaderProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left: Menu button (mobile) + Title */}
            <div className="flex items-center gap-4">
                {showMenuButton && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                    >
                        <Menu size={24} className="text-gray-600" />
                    </button>
                )}

                <h1
                    className="text-2xl font-bold text-slate-800 uppercase tracking-wide"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    {title}
                </h1>
            </div>

            {/* Right: Notifications + User */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Bell size={22} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#F5B500] rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#2E6A9C] flex items-center justify-center">
                            <User size={18} className="text-white" />
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-slate-800">Administrador</p>
                            <p className="text-xs text-slate-500">admin@racemankart.com</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Meu Perfil
                                </a>
                                <a
                                    href="/"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Ver Site
                                </a>
                                <hr className="my-2" />
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Sair
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;
