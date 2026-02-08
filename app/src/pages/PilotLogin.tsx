import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Key, User, ChevronRight, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Pilot {
    id: string;
    name: string;
}

export function PilotLogin() {
    const navigate = useNavigate();
    const [pilots, setPilots] = useState<Pilot[]>([]);
    const [selectedPilotId, setSelectedPilotId] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingPilots, setFetchingPilots] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPilots = async () => {
            const { data, error } = await supabase
                .from('pilots')
                .select('id, name')
                .order('name');

            if (!error && data) {
                setPilots(data);
            }
            setFetchingPilots(false);
        };
        fetchPilots();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background pulse
            gsap.to('.pulse-bg', {
                scale: 1.2,
                opacity: 0.1,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Entrance animation
            const tl = gsap.timeline();
            tl.fromTo(logoRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
            )
                .fromTo(formRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPilotId || pin.length < 4) return;

        setLoading(true);
        setError('');

        try {
            const { data, error: fetchError } = await supabase
                .from('pilots')
                .select('*')
                .eq('id', selectedPilotId)
                .eq('pin', pin)
                .single();

            if (fetchError || !data) {
                setError('PIN incorreto ou piloto não encontrado.');
                gsap.to(formRef.current, {
                    keyframes: [
                        { x: -8, duration: 0.1 },
                        { x: 8, duration: 0.1 },
                        { x: -8, duration: 0.1 },
                        { x: 8, duration: 0.1 },
                        { x: 0, duration: 0.1 }
                    ],
                    ease: 'power2.inOut'
                });
            } else {
                // Save pilot info to session storage (simple approach)
                sessionStorage.setItem('pilot_session', JSON.stringify({
                    id: data.id,
                    name: data.name,
                    category: data.category
                }));
                navigate('/pilot/dashboard');
            }
        } catch (err) {
            setError('Erro ao conectar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden font-display"
            style={{ fontFamily: 'Teko, sans-serif' }}
        >
            {/* Animated Background Pulse */}
            <div className="pulse-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2E6A9C]/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div ref={logoRef} className="text-center mb-8">
                    <img
                        src="/images/logo-rkt.png"
                        alt="RKT Logo"
                        className="h-16 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(46,106,156,0.3)]"
                    />
                    <h1 className="text-5xl font-black italic uppercase italic leading-none tracking-tighter mb-2">
                        <span className="text-[#2E6A9C]">CENTRO DE</span> <span className="text-[#F5B500]">OPERAÇÕES</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.2em] text-xs mt-2">Acesso restrito para pilotos grid 2026</p>
                </div>

                {/* Login Card */}
                <div
                    ref={formRef}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl relative"
                >
                    {/* Visual accent */}
                    <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#F5B500] to-transparent" />

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Pilot Dropdown */}
                        <div className="space-y-2">
                            <label className="text-white/60 text-sm uppercase tracking-widest flex items-center gap-2">
                                <User size={14} className="text-[#F5B500]" />
                                Quem é você?
                            </label>
                            <select
                                value={selectedPilotId}
                                onChange={(e) => setSelectedPilotId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-[#F5B500]/50 focus:bg-white/10 transition-all text-xl uppercase tracking-tighter"
                                required
                                disabled={fetchingPilots}
                            >
                                <option value="" className="bg-[#1a1a1f]">{fetchingPilots ? 'Carregando pilotos...' : 'Selecione seu nome'}</option>
                                {pilots.map(p => (
                                    <option key={p.id} value={p.id} className="bg-[#1a1a1f]">{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* PIN Input */}
                        <div className="space-y-2">
                            <label className="text-white/60 text-sm uppercase tracking-widest flex items-center gap-2">
                                <Key size={14} className="text-[#F5B500]" />
                                PIN de 4 dígitos
                            </label>
                            <input
                                type="password"
                                maxLength={4}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                placeholder="••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-4xl tracking-[1em] placeholder:text-white/5 focus:outline-none focus:border-[#F5B500]/50 focus:bg-white/10 transition-all"
                                required
                            />
                            <div className="flex justify-center gap-4 mt-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${pin.length > i ? 'bg-[#F5B500] scale-125' : 'bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm font-bold uppercase tracking-wider animate-pulse">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading || !selectedPilotId || pin.length < 4}
                            className="w-full bg-[#F5B500] hover:bg-[#ffc633] text-black rounded-xl py-4 text-2xl font-black italic tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(245,181,0,0.2)] hover:shadow-[0_15px_40px_rgba(245,181,0,0.4)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>ACESSAR BOX</span>
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Support */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-white/30 text-xs uppercase tracking-widest">
                        <HelpCircle size={14} />
                        <span>Esqueceu seu PIN? Fale com a organização</span>
                    </div>
                </div>

                {/* Footer Security */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-20">
                    <ShieldCheck size={32} className="text-white" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white">SSL Encrypted Grid Access</span>
                </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
    );
}

export default PilotLogin;
