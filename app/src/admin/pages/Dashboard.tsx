import { Calendar, Users, Trophy, Newspaper, TrendingUp, Clock } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// Upcoming stages
const upcomingStages = [
    { id: 1, name: 'Etapa 4', date: '15/02', local: 'Kartódromo Granja Viana' },
    { id: 2, name: 'Etapa 5', date: '01/03', local: 'Kartódromo RBC' },
    { id: 3, name: 'Etapa 6', date: '15/03', local: 'Kartódromo San Marino' },
];

export function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Próxima Etapa"
                    value="Etapa 4"
                    subtitle="15 de Fevereiro"
                    icon={Calendar}
                    color="brandYellow"
                />
                <StatsCard
                    title="Total de Pilotos"
                    value={42}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    color="blue"
                />
                <StatsCard
                    title="Etapas Realizadas"
                    value="3/10"
                    icon={Trophy}
                    color="green"
                />
                <StatsCard
                    title="Acessos do Mês"
                    value="1.5K"
                    icon={TrendingUp}
                    trend={{ value: 23, isPositive: true }}
                    color="brandBlue"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                    <h3
                        className="text-xl font-bold text-slate-800 mb-4"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        Acessos ao Site
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
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="acessos"
                                    stroke="#2E6A9C"
                                    fillOpacity={1}
                                    fill="url(#colorAcessos)"
                                    strokeWidth={2}
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
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <activity.icon size={18} className="text-[#2E6A9C]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{activity.action}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock size={12} />
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Stages */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3
                    className="text-xl font-bold text-slate-800 mb-4"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    Próximas Etapas
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Etapa</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Data</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Local</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ações</th>
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
                                    <td className="py-3 px-4 text-gray-600">{stage.date}</td>
                                    <td className="py-3 px-4 text-gray-600">{stage.local}</td>
                                    <td className="py-3 px-4 text-right">
                                        <button className="text-[#2E6A9C] hover:underline text-sm font-medium">
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
