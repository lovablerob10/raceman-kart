import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { User, Key, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const bgLinesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background lines animation
            gsap.to('.racing-line', {
                x: '200%',
                duration: 2,
                stagger: 0.2,
                repeat: -1,
                ease: 'none',
                opacity: 0.5
            });

            // Entrance animation
            const tl = gsap.timeline();
            tl.fromTo(logoRef.current,
                { opacity: 0, y: -50, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
            )
                .fromTo(formRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                    '-=0.5'
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate login (simple check for now)
        setTimeout(() => {
            if (username === 'admin' && password === 'rkt2026') {
                navigate('/admin');
            } else {
                setError('Credenciais inválidas. Tente novamente.');
                // Shake animation on error
                gsap.to(formRef.current, {
                    keyframes: [
                        { x: -10, duration: 0.1 },
                        { x: 10, duration: 0.1 },
                        { x: -10, duration: 0.1 },
                        { x: 10, duration: 0.1 },
                        { x: 0, duration: 0.1 }
                    ],
                    ease: 'power2.inOut'
                });
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-display"
            style={{ fontFamily: 'Teko, sans-serif' }}
        >
            {/* Animated Background Lines */}
            <div ref={bgLinesRef} className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="racing-line absolute h-[2px] bg-gradient-to-r from-transparent via-[#F5B500] to-transparent"
                        style={{
                            width: '40%',
                            top: `${10 + i * 8}%`,
                            left: '-50%',
                            transform: 'skewX(-45deg)'
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo Area */}
                <div ref={logoRef} className="text-center mb-10">
                    <div className="inline-block relative">
                        <img
                            src="/images/logo-rkt.png"
                            alt="RKT Logo"
                            className="h-20 md:h-24 mx-auto drop-shadow-[0_0_20px_rgba(245,181,0,0.3)]"
                        />
                        <div className="mt-4 flex flex-col items-center">
                            <span className="text-4xl font-bold italic tracking-tighter text-white uppercase leading-none">
                                RACE<span className="text-[#F5B500]">MAN</span> KART
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-px w-8 bg-[#F5B500]" />
                                <span className="text-sm tracking-[0.3em] text-white/40 uppercase font-black">Admin Access</span>
                                <div className="h-px w-8 bg-[#F5B500]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Form Card */}
                <div
                    ref={formRef}
                    className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group"
                >
                    {/* Top Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#F5B500] to-transparent shadow-[0_0_15px_#F5B500]" />

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-white/60 text-sm uppercase tracking-widest pl-1">Identificação</label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#F5B500] transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="USUÁRIO"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white uppercase tracking-widest placeholder:text-white/10 focus:outline-none focus:border-[#F5B500]/50 focus:bg-white/10 transition-all text-xl"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-white/60 text-sm uppercase tracking-widest pl-1">Código de Acesso</label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#F5B500] transition-colors">
                                    <Key size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white tracking-widest placeholder:text-white/10 focus:outline-none focus:border-[#F5B500]/50 focus:bg-white/10 transition-all text-xl"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 text-[#F5B500] bg-[#F5B500]/10 p-3 rounded-lg border border-[#F5B500]/20 animate-pulse uppercase text-sm tracking-wider font-bold">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#F5B500] hover:bg-[#FFD700] text-black rounded-xl py-4 text-2xl font-black italic tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(245,181,0,0.3)] hover:shadow-[0_15px_40px_rgba(245,181,0,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>ENTRAR NO GRID</span>
                                    <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Lock Icon */}
                    <div className="mt-8 flex justify-center opacity-20">
                        <ShieldCheck size={48} className="text-white" />
                    </div>
                </div>

                {/* Bottom Support Text */}
                <p className="text-center mt-8 text-white/30 text-xs uppercase tracking-[0.2em]">
                    Acesso restrito à equipe técnica e mecânicos raceman kart
                </p>
            </div>

            {/* Vignette Effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
        </div>
    );
}

export default Login;
