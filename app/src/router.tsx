import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';

// Error Boundary Component
function ErrorPage() {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Oops! Algo deu errado.</h1>
            <p className="text-xl mb-4">Desculpe, ocorreu um erro inesperado.</p>
            <div className="bg-black/50 p-6 rounded-lg border border-red-500/30 max-w-2xl w-full overflow-auto">
                <p className="font-mono text-red-300">
                    {error.statusText || error.message || "Erro desconhecido"}
                </p>
                {error.stack && (
                    <pre className="mt-4 text-xs text-gray-500 whitespace-pre-wrap">
                        {error.stack}
                    </pre>
                )}
            </div>
            <button
                onClick={() => window.location.href = '/admin'}
                className="mt-8 px-6 py-2 bg-[#F5B500] text-black font-bold rounded hover:bg-yellow-400"
            >
                Voltar ao Dashboard
            </button>
        </div>
    );
}

// Lazy load admin pages for code splitting
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminStages = lazy(() => import('./admin/pages/Stages'));
const AdminStandings = lazy(() => import('./admin/pages/Standings'));
const AdminChampions = lazy(() => import('./admin/pages/Champions'));
const AdminPilots = lazy(() => import('./admin/pages/Pilots'));
const AdminNews = lazy(() => import('./admin/pages/News'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));
const AdminLogin = lazy(() => import('./admin/pages/Login'));
const AdminMaintenance = lazy(() => import('./admin/pages/Maintenance'));

import PilotLogin from './pages/PilotLogin';
import PilotDashboard from './pages/PilotDashboard';

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
        errorElement: <ErrorPage />,
    },
    {
        path: '/pilot/login',
        element: <PilotLogin />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/pilot/dashboard',
        element: <PilotDashboard />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/admin/login',
        element: (
            <Suspense fallback={<AdminLoader />}>
                <AdminLogin />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: '/admin',
        element: (
            <Suspense fallback={<AdminLoader />}>
                <AdminLayout />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
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
                path: 'campeoes',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminChampions />
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
