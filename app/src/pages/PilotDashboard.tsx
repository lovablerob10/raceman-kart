import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    Wrench,
    Clock,
    CheckCircle,
    AlertCircle,
    Send,
    Plus,
    X,
    User
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PilotSession {
    id: string;
    name: string;
    category: string;
}

interface MaintenanceRequest {
    id: string;
    pilot: string;
    category: string;
    message: string | null;
    status: 'Aberto' | 'Em andamento' | 'Concluído';
    created_at: string;
}

const CATEGORIES = [
    { value: 'troca_pneu', label: 'Troca de Pneu' },
    { value: 'esticar_corrente', label: 'Esticar Corrente' },
    { value: 'revisao', label: 'Revisão Geral' },
    { value: 'ajuste_freio', label: 'Ajuste de Freio' },
    { value: 'troca_oleo', label: 'Troca de Óleo' },
    { value: 'calibragem', label: 'Calibragem' },
    { value: 'outro', label: 'Outro' },
];

export function PilotDashboard() {
    const navigate = useNavigate();
    const [pilot, setPilot] = useState<PilotSession | null>(null);
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [globalRequests, setGlobalRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ category: '', message: '' });

    useEffect(() => {
        const session = sessionStorage.getItem('pilot_session');
        if (!session) {
            navigate('/pilot/login');
            return;
        }
        const parsedSession = JSON.parse(session);
        setPilot(parsedSession);
        fetchMyRequests(parsedSession.name);
        fetchGlobalRequests();

        // Optional: set up realtime subscription for global updates
        const subscription = supabase
            .channel('global_maintenance')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_requests' }, () => {
                fetchGlobalRequests();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);

    const fetchMyRequests = async (pilotName: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('maintenance_requests')
            .select('*')
            .eq('pilot', pilotName)
            .order('created_at', { ascending: false });

        if (!error) {
            setRequests(data || []);
        }
        setLoading(false);
    };

    const fetchGlobalRequests = async () => {
        const { data, error } = await supabase
            .from('maintenance_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error) {
            setGlobalRequests(data || []);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pilot || !formData.category) return;

        setSubmitting(true);
        const { error } = await supabase
            .from('maintenance_requests')
            .insert({
                pilot: pilot.name,
                category: CATEGORIES.find(c => c.value === formData.category)?.label || formData.category,
                message: formData.message || null,
                status: 'Aberto'
            });

        if (!error) {
            setFormData({ category: '', message: '' });
            setShowForm(false);
            fetchMyRequests(pilot.name);
        } else {
            alert('Erro ao enviar pedido.');
        }
        setSubmitting(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('pilot_session');
        navigate('/');
    };

    if (!pilot) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Aberto': return <AlertCircle className="text-yellow-500" size={18} />;
            case 'Em andamento': return <Clock className="text-blue-500" size={18} />;
            case 'Concluído': return <CheckCircle className="text-green-500" size={18} />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aberto': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Em andamento': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Concluído': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-display" style={{ fontFamily: 'Teko, sans-serif' }}>
            {/* Nav */}
            <header className="bg-[#0a0a0f] border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <img src="/images/logo-rkt.png" alt="Logo" className="h-10 drop-shadow-[0_0_10px_rgba(245,181,0,0.3)]" />
                    <div>
                        <h2 className="text-2xl font-bold italic leading-none">{pilot.name}</h2>
                        <span className="text-[10px] uppercase tracking-widest text-[#F5B500] font-black">{pilot.category} CATEGORY</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-red-500 transition-all"
                >
                    <LogOut size={20} />
                    <span className="hidden md:inline uppercase tracking-widest text-sm">Sair</span>
                </button>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Hero / Action */}
                    <div className="bg-gradient-to-br from-[#2E6A9C]/20 to-transparent p-8 rounded-3xl border border-white/5 relative overflow-hidden group h-fit">
                        <div className="relative z-10">
                            <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter mb-2">
                                CENTRO DE <span className="text-[#F5B500]">OPERAÇÕES</span>
                            </h1>
                            <p className="text-white/60 uppercase tracking-widest text-sm mb-6">Área técnica exclusiva para pilotos</p>

                            {!showForm ? (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="w-full bg-[#F5B500] hover:bg-[#ffc633] text-black px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-xl transition-all shadow-xl active:scale-95"
                                >
                                    <Plus size={24} />
                                    FAZER NOVO PEDIDO
                                </button>
                            ) : (
                                <div className="bg-[#1a1a1f] p-6 rounded-2xl border border-white/10 relative">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="absolute top-4 right-4 text-white/40 hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                    <h3 className="text-2xl font-bold italic mb-6">NOVA SOLICITAÇÃO</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                        <div className="space-y-1">
                                            <label className="text-white/40 text-xs uppercase tracking-widest">Manutenção</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none text-xl"
                                                required
                                            >
                                                <option value="" className="bg-[#1a1a1f]">Selecione o tipo...</option>
                                                {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-[#1a1a1f]">{c.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-white/40 text-xs uppercase tracking-widest">Detalhes</label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Ex: Trepidação no freio traseiro..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg min-h-[100px] resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-[#F5B500] text-black py-4 rounded-xl font-bold uppercase text-xl flex items-center justify-center gap-3 transition-all hover:bg-[#ffc633]"
                                        >
                                            {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} /> ENVIAR PARA O BOX</>}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status do Grid - Global Feed (Simulated or Real-time) */}
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 h-fit max-h-[500px] overflow-hidden flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[#2E6A9C]/20 flex items-center justify-center border border-[#2E6A9C]/30">
                                <Clock className="text-[#F5B500]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold italic uppercase leading-none">Status do Grid</h3>
                                <p className="text-[10px] uppercase tracking-widest text-white/30">Atualizações em tempo real</p>
                            </div>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {globalRequests.length === 0 ? (
                                <p className="text-white/20 text-xs uppercase italic tracking-widest text-center py-8 border border-dashed border-white/5 rounded-xl">
                                    Aguardando atualizações...
                                </p>
                            ) : (
                                globalRequests.map(req => (
                                    <div key={req.id} className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#F5B500]">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold uppercase italic leading-none">{req.pilot}</p>
                                                <p className="text-[10px] text-[#F5B500] uppercase font-black mt-1">{req.category}</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-3xl font-bold italic tracking-tighter uppercase text-white">MEUS <span className="text-[#2E6A9C]">PEDIDOS</span></h3>
                        <span className="text-white/20 uppercase tracking-widest text-xs">{requests.length} total</span>
                    </div>

                    <div className="space-y-4">
                        {loading && requests.length === 0 ? (
                            <div className="text-center py-12 text-white/20 uppercase tracking-widest text-sm animate-pulse">Sincronizando grid...</div>
                        ) : requests.length === 0 ? (
                            <div className="bg-white/5 border border-dashed border-white/10 border-white/10 rounded-2xl p-12 text-center">
                                <Wrench size={48} className="text-white/10 mx-auto mb-4" />
                                <p className="text-white/30 uppercase tracking-widest text-sm font-bold">Nenhuma manutenção registrada</p>
                            </div>
                        ) : (
                            requests.map(req => (
                                <div key={req.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-2xl font-bold italic leading-none">{req.category}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1.5 ${getStatusColor(req.status)}`}>
                                            {getStatusIcon(req.status)}
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-white/50 text-sm mb-3">
                                        {req.message || 'Sem detalhes adicionais.'}
                                    </p>
                                    <div className="text-[10px] uppercase tracking-widest text-white/20">
                                        SOLICITADO EM {new Date(req.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Background elements */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#F5B500]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        </div>
    );
}

export default PilotDashboard;
