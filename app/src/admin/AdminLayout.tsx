import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AdminHeader } from './components/AdminHeader';
import { Menu, X } from 'lucide-react';

// Page titles mapping
const pageTitles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/etapas': 'Gestão de Etapas',
    '/admin/classificacao': 'Classificação Geral',
    '/admin/pilotos': 'Gestão de Pilotos',
    '/admin/noticias': 'Notícias & Galeria',
    '/admin/configuracoes': 'Configurações',
};

export function AdminLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Get current page title
    const currentTitle = pageTitles[location.pathname] || 'Dashboard';

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 text-white hover:bg-slate-800 rounded-lg"
                        >
                            <X size={24} />
                        </button>
                        <Sidebar
                            collapsed={false}
                            onToggle={() => setMobileMenuOpen(false)}
                        />
                    </div>
                </>
            )}

            {/* Main Content */}
            <main
                className={`
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
            >
                {/* Header */}
                <AdminHeader
                    title={currentTitle}
                    onMenuClick={() => setMobileMenuOpen(true)}
                    showMenuButton={true}
                />

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
