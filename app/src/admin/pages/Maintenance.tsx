import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    Search,
    Filter,
    Wrench,
    RefreshCw,
    MoreVertical,
    ArrowRight
} from 'lucide-react';

interface MaintenanceRequest {
    id: string;
    pilot: string;
    category: string;
    message: string | null;
    status: 'Aberto' | 'Em andamento' | 'Concluído';
    created_at: string;
}

export function Maintenance() {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'Aberto' | 'Em andamento' | 'Concluído'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('maintenance_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching requests:', error);
        } else {
            setRequests(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: MaintenanceRequest['status']) => {
        setUpdatingId(id);
        const { error } = await supabase
            .from('maintenance_requests')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
        } else {
            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ));
        }
        setUpdatingId(null);
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
        const matchesSearch =
            req.pilot.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (req.message && req.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
            req.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Aberto': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Em andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Abertos</p>
                        <p className="text-2xl font-bold text-slate-800 leading-none mt-1">
                            {requests.filter(r => r.status === 'Aberto').length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Em Andamento</p>
                        <p className="text-2xl font-bold text-slate-800 leading-none mt-1">
                            {requests.filter(r => r.status === 'Em andamento').length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Concluídos</p>
                        <p className="text-2xl font-bold text-slate-800 leading-none mt-1">
                            {requests.filter(r => r.status === 'Concluído').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por piloto ou problema..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C] focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C] appearance-none cursor-pointer bg-white"
                        >
                            <option value="ALL">Todos Status</option>
                            <option value="Aberto">Abertos</option>
                            <option value="Em andamento">Em Andamento</option>
                            <option value="Concluído">Concluídos</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={fetchRequests}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span>Atualizar</span>
                </button>
            </div>

            {/* Table / List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Piloto</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Categoria / Solicitação</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Data</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCw size={40} className="text-gray-200 animate-spin" />
                                            <p className="text-gray-400 font-medium">Buscando solicitações...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Wrench size={40} className="text-gray-200" />
                                            <p className="text-gray-400 font-medium">Nenhum pedido encontrado.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                    <User size={20} />
                                                </div>
                                                <span className="font-bold text-slate-800" style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.2rem' }}>
                                                    {req.pilot}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#F5B500] uppercase tracking-wide">
                                                    {req.category}
                                                </span>
                                                {req.message && (
                                                    <span className="text-gray-500 text-sm mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                                                        {req.message}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="text-xs font-medium text-gray-400 uppercase">
                                                {formatDate(req.created_at)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(req.status)} uppercase tracking-wider inline-flex items-center gap-1.5`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Aberto' ? 'bg-yellow-500' :
                                                    req.status === 'Em andamento' ? 'bg-blue-500' : 'bg-green-500'
                                                    }`} />
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === 'Aberto' && (
                                                    <button
                                                        onClick={() => updateStatus(req.id, 'Em andamento')}
                                                        disabled={updatingId === req.id}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-tight"
                                                        title="Iniciar Manutenção"
                                                    >
                                                        {updatingId === req.id ? <RefreshCw size={16} className="animate-spin" /> : <Clock size={16} />}
                                                        <span className="hidden sm:inline">Iniciar</span>
                                                    </button>
                                                )}
                                                {req.status === 'Em andamento' && (
                                                    <button
                                                        onClick={() => updateStatus(req.id, 'Concluído')}
                                                        disabled={updatingId === req.id}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-tight"
                                                        title="Concluir Manutenção"
                                                    >
                                                        {updatingId === req.id ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                        <span className="hidden sm:inline">Concluir</span>
                                                    </button>
                                                )}
                                                <div className="w-px h-6 bg-gray-100 mx-1" />
                                                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Helper text */}
            <div className="bg-slate-800 text-white p-6 rounded-xl flex items-center justify-between shadow-lg shadow-slate-900/20 overflow-hidden relative">
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Wrench className="text-[#F5B500]" size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold italic uppercase tracking-tighter" style={{ fontFamily: 'Teko, sans-serif' }}>
                            Fluxo de Trabalho
                        </h4>
                        <p className="text-white/60 text-sm">
                            Atualize os status em tempo real para informar os pilotos no grid.
                        </p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-8 relative z-10 mr-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-yellow-500 mb-1">Passo 1</span>
                        <div className="px-3 py-1 bg-yellow-500/20 rounded-md border border-yellow-500/30 text-xs font-bold">ABERTO</div>
                    </div>
                    <ArrowRight className="text-white/20" size={20} />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-blue-500 mb-1">Passo 2</span>
                        <div className="px-3 py-1 bg-blue-500/20 rounded-md border border-blue-500/30 text-xs font-bold">EM ANDAMENTO</div>
                    </div>
                    <ArrowRight className="text-white/20" size={20} />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-green-500 mb-1">Passo 3</span>
                        <div className="px-3 py-1 bg-green-500/20 rounded-md border border-green-500/30 text-xs font-bold">CONCLUÍDO</div>
                    </div>
                </div>
                {/* Visual accent */}
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#F5B500]/20 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}

export default Maintenance;
