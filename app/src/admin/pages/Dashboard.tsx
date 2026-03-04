import { useEffect, useState } from 'react';
import { Calendar, Users, Trophy, TrendingUp, Clock, MapPin } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { supabase } from '../../lib/supabase';

interface StageRow {
    id: string;
    name: string;
    date: string;
    location: string;
    status: string;
}

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
                    title="Total de Etapas"
                    value={totalStages}
                    subtitle="Temporada 2026"
                    icon={TrendingUp}
                    color="brandBlue"
                />
            </div>

            {/* Upcoming Stages Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3
                    className="text-xl font-bold text-slate-800 mb-4"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    Próximas Etapas
                </h3>

                {upcomingStages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Todas as etapas foram realizadas!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Etapa</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Data</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Local</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingStages.map((stage) => (
                                    <tr key={stage.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <span
                                                className="font-bold text-slate-800"
                                                style={{ fontFamily: 'Teko, sans-serif' }}
                                            >
                                                {stage.name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-gray-400" />
                                                {formatShortDate(stage.date)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-gray-400" />
                                                {stage.location}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
                    Todas as Etapas da Temporada
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {stages.map((stage) => {
                        const isPast = new Date(stage.date) < new Date() || stage.status === 'completed';
                        return (
                            <div
                                key={stage.id}
                                className={`p-3 rounded-xl border text-center transition-all ${isPast
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <span
                                    className="block font-bold text-slate-800 text-lg"
                                    style={{ fontFamily: 'Teko, sans-serif' }}
                                >
                                    {stage.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatShortDate(stage.date)}
                                </span>
                                <div className="mt-1.5">
                                    {isPast ? (
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">✓ Realizada</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pendente</span>
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
