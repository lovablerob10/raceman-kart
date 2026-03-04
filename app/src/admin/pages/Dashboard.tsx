import { useEffect, useState } from 'react';
import { Calendar, Users, Trophy, TrendingUp, Clock, MapPin, Newspaper } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

interface StageRow {
    id: string;
    name: string;
    date: string;
    location: string;
    status: string;
}

// Mock data for chart
const chartData = [
    { name: 'Jan', acessos: 400 },
    { name: 'Fev', acessos: 600 },
    { name: 'Mar', acessos: 800 },
    { name: 'Abr', acessos: 1200 },
    { name: 'Mai', acessos: 950 },
    { name: 'Jun', acessos: 1500 },
];

// Mock data for recent activities
const recentActivities = [
    { id: 1, action: 'Etapa 3 atualizada', time: '5 min atrás', icon: Calendar },
    { id: 2, action: 'Novo piloto cadastrado', time: '1 hora atrás', icon: Users },
    { id: 3, action: 'Pontuação atualizada', time: '2 horas atrás', icon: Trophy },
    { id: 4, action: 'Notícia publicada', time: '1 dia atrás', icon: Newspaper },
];

export function Dashboard() {
    const [totalPilots, setTotalPilots] = useState<number>(0);
    const [stages, setStages] = useState<StageRow[]>([]);
    const [completedStages, setCompletedStages] = useState<number>(0);
    const [totalStages, setTotalStages] = useState<number>(0);
    const [nextStage, setNextStage] = useState<StageRow | null>(null);
    const [upcomingStages, setUpcomingStages] = useState<StageRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch total pilots count
            const { count: pilotCount } = await supabase
                .from('pilots')
                .select('*', { count: 'exact', head: true });

            setTotalPilots(pilotCount || 0);

            // Fetch all stages
            const { data: stagesData } = await supabase
                .from('stages')
                .select('*')
                .order('date', { ascending: true });

            if (stagesData) {
                setStages(stagesData);
                setTotalStages(stagesData.length);

                const now = new Date();

                // Calculate completed stages (date is in the past)
                const completed = stagesData.filter((s: StageRow) => {
                    const stageDate = new Date(s.date);
                    return stageDate < now || s.status === 'completed';
                });
                setCompletedStages(completed.length);

                // Find next upcoming stage
                const upcoming = stagesData.filter((s: StageRow) => {
                    const stageDate = new Date(s.date);
                    return stageDate >= now && s.status !== 'completed';
                });

                if (upcoming.length > 0) {
                    setNextStage(upcoming[0]);
                    setUpcomingStages(upcoming.slice(0, 5));
                }
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long'
        });
    };

    const formatShortDate = (dateStr: string): string => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-6 rounded-xl border bg-white shadow-sm animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Próxima Etapa"
                    value={nextStage?.name || 'Nenhuma'}
                    subtitle={nextStage ? formatDate(nextStage.date) : 'Sem etapas futuras'}
                    icon={Calendar}
                    color="brandYellow"
                />
                <StatsCard
                    title="Total de Pilotos"
                    value={totalPilots}
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Etapas Realizadas"
                    value={`${completedStages}/${totalStages}`}
                    icon={Trophy}
                    color="green"
                />
                <StatsCard
                    title="Acessos do Mês"
                    value="1.5K"
                    subtitle="Temporada 2026"
                    trend={{ value: 23, isPositive: true }}
                    icon={TrendingUp}
                    color="brandBlue"
                />
            </div>

            {/* Main Content Grid with Chart and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                    <h3
                        className="text-xl font-bold text-slate-800 mb-4"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        Evolução de Acessos ao Site
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2E6A9C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2E6A9C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="acessos"
                                    stroke="#2E6A9C"
                                    fillOpacity={1}
                                    fill="url(#colorAcessos)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3
                        className="text-xl font-bold text-slate-800 mb-4"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        Atividades Recentes
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                    <activity.icon size={18} className="text-[#2E6A9C]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{activity.action}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                        <Clock size={12} />
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Stages Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3
                    className="text-xl font-bold text-slate-800 mb-4"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    Calendário de Próximas Etapas
                </h3>

                {upcomingStages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <Trophy size={40} className="mx-auto mb-3 opacity-30 text-gray-400" />
                        <p className="font-medium text-gray-500">Todas as etapas da temporada foram realizadas!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Local</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingStages.map((stage) => (
                                    <tr key={stage.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span
                                                className="font-bold text-slate-800 text-lg"
                                                style={{ fontFamily: 'Teko, sans-serif' }}
                                            >
                                                {stage.name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Calendar size={14} className="text-[#2E6A9C]" />
                                                {formatShortDate(stage.date)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-red-500" />
                                                {stage.location}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                Agendada
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* All Stages Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3
                    className="text-xl font-bold text-slate-800 mb-4"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    Visão Geral da Temporada
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {stages.map((stage) => {
                        const isPast = new Date(stage.date) < new Date() || stage.status === 'completed';
                        return (
                            <div
                                key={stage.id}
                                className={`p-4 rounded-xl border text-center transition-all duration-300 hover:-translate-y-1 ${isPast
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm'
                                    : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
                                    }`}
                            >
                                <span
                                    className="block font-bold text-slate-800 text-xl tracking-wide"
                                    style={{ fontFamily: 'Teko, sans-serif' }}
                                >
                                    {stage.name}
                                </span>
                                <span className="text-xs font-medium text-slate-500 mt-1 block">
                                    {formatShortDate(stage.date)}
                                </span>
                                <div className="mt-2 pt-2 border-t border-gray-200/50">
                                    {isPast ? (
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-center gap-1">
                                            <Trophy size={10} /> Realizada
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1">
                                            <Clock size={10} /> Pendente
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
