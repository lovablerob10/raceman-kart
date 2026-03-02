import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Mail, Key, ChevronRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Login() {
    const navigate = useNavigate();
    const { signIn, user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const bgLinesRef = useRef<HTMLDivElement>(null);

    // If already logged in, redirect
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/admin', { replace: true });
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background racing lines
            gsap.to('.racing-line', {
                x: '200%',
                duration: 2,
                stagger: 0.2,
                repeat: -1,
                ease: 'none',
                opacity: 0.5
            });

            // Floating particles
            gsap.to('.auth-particle', {
                y: -30,
                opacity: 0.6,
                duration: 2,
                stagger: 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        setError('');

        const { error: authError } = await signIn(email, password);

        if (authError) {
            let msg = 'Credenciais inválidas. Tente novamente.';
            if (authError.includes('Invalid login')) {
                msg = 'Email ou senha incorretos.';
            } else if (authError.includes('Email not confirmed')) {
                msg = 'Este email ainda não foi confirmado.';
            }
            setError(msg);

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

            setLoading(false);
        }
        // On success, the auth listener will trigger navigation
    };

    // Don't render form if still checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#F5B500] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-display"
            style={{ fontFamily: 'Teko, sans-serif' }}
        >
            {/* Animated Background Racing Lines */}
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

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="auth-particle absolute w-1 h-1 bg-[#F5B500] rounded-full opacity-0"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                    />
                ))}
            </div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2E6A9C]/10 rounded-full blur-[150px] pointer-events-none" />

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
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-white/60 text-sm uppercase tracking-widest pl-1">Email</label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#F5B500] transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@racemankart.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white tracking-wider placeholder:text-white/15 focus:outline-none focus:border-[#F5B500]/50 focus:bg-white/10 transition-all text-lg"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-white/60 text-sm uppercase tracking-widest pl-1">Senha</label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-[#F5B500] transition-colors">
                                    <Key size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white tracking-widest placeholder:text-white/15 focus:outline-none focus:border-[#F5B500]/50 focus:bg-white/10 transition-all text-lg"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#F5B500] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
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
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                                    <span>VERIFICANDO...</span>
                                </div>
                            ) : (
                                <>
                                    <span>ENTRAR NO GRID</span>
                                    <ChevronRight size={28} className="group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Lock Icon */}
                    <div className="mt-8 flex flex-col items-center gap-2 opacity-20">
                        <ShieldCheck size={36} className="text-white" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white">Autenticação Segura</span>
                    </div>
                </div>

                {/* Bottom Support Text */}
                <p className="text-center mt-8 text-white/30 text-xs uppercase tracking-[0.2em]">
                    Acesso restrito à equipe técnica raceman kart
                </p>
            </div>

            {/* Vignette Effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
        </div>
    );
}

export default Login;
