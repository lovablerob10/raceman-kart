import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Wrench, Clock, CheckCircle, AlertCircle, User, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface MaintenanceRequest {
    id: string;
    pilot: string;
    category: string;
    message: string;
    status: 'Aberto' | 'Em andamento' | 'Concluído';
    created_at: string;
}

export function MaintenanceRequests() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    // Maintenance categories are now managed in the Pilot Portal
    const listRef = useRef<HTMLDivElement>(null);

    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch requests from Supabase
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('maintenance_requests')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                console.error('Error fetching requests:', error);
            } else {
                setRequests(data || []);
            }
        } catch (err) {
            console.error('Error:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // GSAP animations
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, x: -80 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        once: true
                    }
                }
            );

            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        once: true
                    }
                }
            );

            gsap.fromTo(
                listRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 0.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        once: true
                    }
                }
            );
        }, section);

        return () => ctx.revert();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Aberto':
                return <AlertCircle className="text-yellow-500" size={18} />;
            case 'Em andamento':
                return <Clock className="text-blue-500" size={18} />;
            case 'Concluído':
                return <CheckCircle className="text-green-500" size={18} />;
            default:
                return <AlertCircle className="text-gray-500" size={18} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aberto':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Em andamento':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Concluído':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <section
            ref={sectionRef}
            id="pedidos"
            className="py-16 md:py-24 bg-[#0d0d12] relative overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,181,0,0.08),transparent_60%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5B500]/50 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <h2
                        ref={titleRef}
                        className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase italic text-white flex items-center leading-none tracking-tighter"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        <span className="w-3 h-12 md:h-16 bg-[#F5B500] mr-4 inline-block transform -skew-x-12 shadow-[0_0_15px_rgba(245,181,0,0.5)]" />
                        Pedidos ao Mecânico
                    </h2>
                    <p className="text-white/60 mt-4 text-lg max-w-2xl">
                        Solicite manutenção para seu kart. O mecânico receberá seu pedido em tempo real.
                    </p>
                    <div className="h-1 w-48 bg-gradient-to-r from-[#F5B500] to-transparent mt-4 opacity-50" />
                </div>

                {/* Main content - Stats + Feed */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* CTA Card for Pilots */}
                    <div
                        ref={formRef}
                        className="lg:col-span-1 bg-gradient-to-br from-[#2E6A9C]/30 to-transparent backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex flex-col justify-center items-center text-center relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Wrench size={120} />
                        </div>

                        <div className="w-20 h-20 rounded-2xl bg-[#F5B500] flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(245,181,0,0.4)] relative z-10 transition-transform group-hover:rotate-12">
                            <User className="text-black" size={40} />
                        </div>

                        <h3 className="text-4xl font-black italic uppercase leading-none mb-4 relative z-10" style={{ fontFamily: 'Teko, sans-serif' }}>
                            <span className="text-[#2E6A9C]">ÁREA DO</span> <span className="text-[#F5B500]">PILOTO</span>
                        </h3>
                        <p className="text-white/60 mb-8 max-w-[250px] relative z-10">
                            Acesse seu painel exclusivo para solicitar manutenção e acompanhar seu kart.
                        </p>

                        <button
                            onClick={() => window.location.href = '/pilot/login'}
                            className="w-full py-4 bg-[#F5B500] text-black rounded-xl font-bold uppercase tracking-widest
                                     hover:bg-white hover:scale-[1.02]
                                     transition-all duration-300 flex items-center justify-center gap-3 relative z-10"
                            style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.25rem' }}
                        >
                            <Send size={22} className="text-black" />
                            FAZER PEDIDO
                        </button>

                        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/30 font-black relative z-10">
                            ACESSO RESTRITO • GRID 2026
                        </p>
                    </div>

                    {/* Requests List (Public Feed) */}
                    <div ref={listRef} className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#2E6A9C]/20 flex items-center justify-center border border-[#2E6A9C]/30">
                                    <Clock className="text-[#F5B500]" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white uppercase italic leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        Status do Grid
                                    </h3>
                                    <p className="text-white/40 text-sm uppercase tracking-widest mt-1">Atualizações em tempo real</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchRequests}
                                className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-[#F5B500] hover:bg-white/10 transition-all shadow-inner"
                            >
                                <div className={loading ? 'animate-spin' : ''}>
                                    <Clock size={20} />
                                </div>
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-[#F5B500] rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-white/50">Carregando pedidos...</p>
                                </div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-12">
                                    <Wrench className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/50">Nenhum pedido ainda</p>
                                    <p className="text-white/30 text-sm">Seja o primeiro a fazer um pedido!</p>
                                </div>
                            ) : (
                                requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-[#2E6A9C]/30 transition-all hover:bg-white/[0.08]"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <User className="text-[#F5B500]" size={16} />
                                                <span className="font-bold text-white uppercase italic" style={{ fontSize: '1.2rem' }}>{request.pilot}</span>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1.5 border ${getStatusColor(request.status)} tracking-widest`}
                                            >
                                                {getStatusIcon(request.status)}
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-[#F5B500] font-black uppercase italic tracking-wider">{request.category}</span>
                                        </div>
                                        {request.message && (
                                            <p className="text-white/60 text-sm mb-2">{request.message}</p>
                                        )}
                                        <div className="text-white/20 text-[10px] uppercase tracking-widest">
                                            {formatDate(request.created_at)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5B500]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-64 h-64 bg-[#2E6A9C]/10 rounded-full blur-3xl pointer-events-none" />
        </section>
    );
}

export default MaintenanceRequests;
