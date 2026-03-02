import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-[#F5B500]/20 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-[#F5B500] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <span
                        className="text-white/60 uppercase tracking-[0.3em] text-sm"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        Verificando credenciais...
                    </span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
