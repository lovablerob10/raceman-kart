import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Trophy,
    Users,
    Newspaper,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Etapas', path: '/admin/etapas' },
    { icon: Trophy, label: 'Classificação', path: '/admin/classificacao' },
    { icon: Users, label: 'Pilotos', path: '/admin/pilotos' },
    { icon: Newspaper, label: 'Notícias', path: '/admin/noticias' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen bg-[#2D2D2D] text-white z-40
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        flex flex-col
      `}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
                <div
                    className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? 'px-2' : ''}`}
                >
                    <img
                        src="/images/logo-rkt.png"
                        alt="RKT Logo"
                        className={`transition-all duration-300 ${collapsed ? 'h-8' : 'h-10'}`}
                    />
                    {!collapsed && (
                        <span
                            className="font-bold italic tracking-tighter text-xl"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            <span className="text-white">RACEMAN</span>
                            <span className="text-[#F5B500]"> KART</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto">
                <ul className="space-y-2 px-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-lg
                  transition-all duration-200
                  group relative
                  ${isActive
                                        ? 'bg-[#2E6A9C] text-white shadow-lg shadow-[#2E6A9C]/30'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-[#F5B500]'
                                    }
                `}
                            >
                                <item.icon
                                    size={22}
                                    className="flex-shrink-0 transition-transform group-hover:scale-110"
                                />
                                <span
                                    className={`
                    font-medium whitespace-nowrap
                    transition-all duration-300
                    ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}
                  `}
                                    style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.1rem' }}
                                >
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="
                    absolute left-full ml-3 px-3 py-2 
                    bg-slate-800 text-white text-sm font-medium
                    rounded-md shadow-lg
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200
                    whitespace-nowrap z-50
                  ">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-slate-700 p-4 space-y-2">
                {/* Collapse Toggle */}
                <button
                    onClick={onToggle}
                    className="
            w-full flex items-center justify-center gap-2 
            px-4 py-2 rounded-lg
            text-slate-400 hover:text-white hover:bg-slate-800
            transition-all duration-200
          "
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {!collapsed && (
                        <span style={{ fontFamily: 'Teko, sans-serif' }}>Recolher</span>
                    )}
                </button>

                {/* Logout */}
                <button
                    className="
            w-full flex items-center justify-center gap-2 
            px-4 py-2 rounded-lg
            text-slate-400 hover:text-red-500 hover:bg-white/5
            transition-all duration-200
          "
                >
                    <LogOut size={20} />
                    {!collapsed && (
                        <span style={{ fontFamily: 'Teko, sans-serif' }}>Sair</span>
                    )}
                </button>
            </div>

            {/* Racing stripe decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E6A9C] via-[#2E6A9C] to-[#F5B500]" />
        </aside >
    );
}

export default Sidebar;
