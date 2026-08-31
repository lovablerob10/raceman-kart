import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { Toaster } from 'sonner';

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
const AdminSponsors = lazy(() => import('./admin/pages/Sponsors'));
const Inscricao2027 = lazy(() => import('./pages/Inscricao2027'));

// Paginas de secao: cada item do menu tem url propria. As secoes continuam
// existindo na home, que segue sendo a pagina longa.
const SecaoPage = lazy(() => import('./pages/SecaoPage'));
const SecCalendar = lazy(() => import('./sections/Calendar').then(m => ({ default: m.Calendar })));
const SecDrivers = lazy(() => import('./sections/Drivers').then(m => ({ default: m.Drivers })));
const SecStandings = lazy(() => import('./sections/Standings').then(m => ({ default: m.Standings })));
const SecChampions = lazy(() => import('./sections/Champions').then(m => ({ default: m.Champions })));
const SecInstagram = lazy(() => import('./sections/InstagramFeed').then(m => ({ default: m.InstagramFeed })));
const SecSponsors = lazy(() => import('./sections/Sponsors').then(m => ({ default: m.Sponsors })));

const paginasDeSecao = [
    { path: '/calendario', Secao: SecCalendar },
    { path: '/categorias', Secao: SecDrivers },
    { path: '/classificacao', Secao: SecStandings },
    { path: '/campeoes', Secao: SecChampions },
    { path: '/instagram', Secao: SecInstagram },
    { path: '/patrocinadores', Secao: SecSponsors },
];

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
        path: '/inscricao2027',
        element: (
            <Suspense fallback={<AdminLoader />}>
                <Inscricao2027 />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
    },
    ...paginasDeSecao.map(({ path, Secao }) => ({
        path,
        element: (
            <Suspense fallback={<AdminLoader />}>
                <SecaoPage>
                    <Secao />
                </SecaoPage>
            </Suspense>
        ),
        errorElement: <ErrorPage />,
    })),
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
            <ProtectedRoute>
                <Suspense fallback={<AdminLoader />}>
                    <AdminLayout />
                </Suspense>
            </ProtectedRoute>
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
            {
                path: 'patrocinadores',
                element: (
                    <Suspense fallback={<AdminLoader />}>
                        <AdminSponsors />
                    </Suspense>
                ),
            },
        ],
    },
]);

export function AppRouter() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" richColors />
        </AuthProvider>
    );
}

export default AppRouter;
