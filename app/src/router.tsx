import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';

// Lazy load admin pages for code splitting
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminStages = lazy(() => import('./admin/pages/Stages'));
const AdminStandings = lazy(() => import('./admin/pages/Standings'));
const AdminPilots = lazy(() => import('./admin/pages/Pilots'));
const AdminNews = lazy(() => import('./admin/pages/News'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));
const AdminLogin = lazy(() => import('./admin/pages/Login'));
const AdminMaintenance = lazy(() => import('./admin/pages/Maintenance'));
const PilotLogin = lazy(() => import('./pages/PilotLogin'));
const PilotDashboard = lazy(() => import('./pages/PilotDashboard'));

// Loading fallback
const AdminLoader = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-white font-display text-xl" style={{ fontFamily: 'Teko, sans-serif' }}>
                Carregando...
            </span>
        </div>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/pilot/login',
        element: (
            <Suspense fallback={<AdminLoader />}>
                <PilotLogin />
            </Suspense>
        ),
    },
    {
        path: '/pilot/dashboard',
        element: (
            <Suspense fallback={<AdminLoader />}>
                <PilotDashboard />
            </Suspense>
        ),
    },
    {
        path: '/admin/login',
        element: (
            <Suspense fallback={<AdminLoader />}>
                <AdminLogin />
            </Suspense>
        ),
    },
    {
        path: '/admin',
        element: (
            <Suspense fallback={<AdminLoader />}>
                <AdminLayout />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminDashboard />
                    </Suspense>
                ),
            },
            {
                path: 'etapas',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminStages />
                    </Suspense>
                ),
            },
            {
                path: 'manutencao',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminMaintenance />
                    </Suspense>
                ),
            },
            {
                path: 'classificacao',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminStandings />
                    </Suspense>
                ),
            },
            {
                path: 'pilotos',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminPilots />
                    </Suspense>
                ),
            },
            {
                path: 'noticias',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminNews />
                    </Suspense>
                ),
            },
            {
                path: 'configuracoes',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminSettings />
                    </Suspense>
                ),
            },
        ],
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;
