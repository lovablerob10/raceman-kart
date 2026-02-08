import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shirt, User, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface UniformData {
    piloto: string;
    camisa: string;
    numero: string;
    categoria: 'PRO' | 'LIGHT';
}

// Complete 2026 Uniforms Data
const UNIFORMES_2026: UniformData[] = [
    // Categoria PRO
    { piloto: 'Lucas Silveira', camisa: 'Silveira Racing', numero: '27', categoria: 'PRO' },
    { piloto: 'Bruno Oliveira', camisa: 'Oliveira #45', numero: '45', categoria: 'PRO' },
    { piloto: 'Marco Aurélio', camisa: 'Aurélio Motorsport', numero: '07', categoria: 'PRO' },
    { piloto: 'Gabriel Santos', camisa: 'Santos Racing', numero: '88', categoria: 'PRO' },
    { piloto: 'Daniel Mendes', camisa: 'Mendes #03', numero: '03', categoria: 'PRO' },
    { piloto: 'Gustavo Lima', camisa: 'Lima Racing Team', numero: '82', categoria: 'PRO' },
    // Categoria LIGHT
    { piloto: 'Thiago Oliveira', camisa: 'T. Oliveira Racing', numero: '12', categoria: 'LIGHT' },
    { piloto: 'João Pedro', camisa: 'JP Kart', numero: '33', categoria: 'LIGHT' },
    { piloto: 'Mateus Silva', camisa: 'Silva #55', numero: '55', categoria: 'LIGHT' },
    { piloto: 'Vinícius Souza', camisa: 'Souza Racing', numero: '77', categoria: 'LIGHT' },
    { piloto: 'Leonardo Ferreira', camisa: 'Ferreira #99', numero: '99', categoria: 'LIGHT' },
    { piloto: 'Rafael Gomes', camisa: 'Gomes Motorsport', numero: '21', categoria: 'LIGHT' },
];

export function Uniforms() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Title animation
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

            // Cards stagger animation
            const cards = cardsRef.current?.querySelectorAll('.uniform-card');
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 40, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.08,
                        ease: 'back.out(1.2)',
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            }
        }, section);

        return () => ctx.revert();
    }, []);

    const proUniforms = UNIFORMES_2026.filter(u => u.categoria === 'PRO');
    const lightUniforms = UNIFORMES_2026.filter(u => u.categoria === 'LIGHT');

    return (
        <section
            ref={sectionRef}
            id="uniformes"
            className="py-16 md:py-24 bg-[#0a0a0f] relative overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,106,156,0.15),transparent_50%)]" />
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
                        Uniformes 2026
                    </h2>
                    <p className="text-white/60 mt-4 text-lg max-w-2xl">
                        Confira o texto personalizado que cada piloto terá estampado em seu uniforme oficial da temporada.
                    </p>
                    <div className="h-1 w-48 bg-gradient-to-r from-[#F5B500] to-transparent mt-4 opacity-50" />
                </div>

                {/* PRO Category */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="text-[#F5B500]" size={24} />
                        <h3
                            className="text-3xl font-bold uppercase text-white tracking-wider"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            Categoria PRO
                        </h3>
                    </div>

                    <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {proUniforms.map((uniform) => (
                            <UniformCard key={uniform.piloto} uniform={uniform} />
                        ))}
                    </div>
                </div>

                {/* LIGHT Category */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="text-[#2E6A9C]" size={24} />
                        <h3
                            className="text-3xl font-bold uppercase text-white tracking-wider"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            Categoria LIGHT
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lightUniforms.map((uniform) => (
                            <UniformCard key={uniform.piloto} uniform={uniform} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F5B500]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 left-0 w-64 h-64 bg-[#2E6A9C]/10 rounded-full blur-3xl pointer-events-none" />
        </section>
    );
}

function UniformCard({ uniform }: { uniform: UniformData }) {
    const isPro = uniform.categoria === 'PRO';
    const accentColor = isPro ? '#F5B500' : '#2E6A9C';

    return (
        <article
            className="uniform-card group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
            {/* Top accent bar */}
            <div
                className="h-1 w-full"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
            />

            <div className="p-6">
                {/* Number badge */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                            style={{
                                backgroundColor: `${accentColor}20`,
                                boxShadow: `0 0 20px ${accentColor}30`
                            }}
                        >
                            <User size={24} style={{ color: accentColor }} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg leading-tight">{uniform.piloto}</h4>
                            <span
                                className="text-xs uppercase tracking-widest font-bold"
                                style={{ color: accentColor }}
                            >
                                {uniform.categoria}
                            </span>
                        </div>
                    </div>

                    {/* Number */}
                    <div
                        className="text-4xl font-black italic opacity-30 group-hover:opacity-60 transition-opacity"
                        style={{ fontFamily: 'Teko, sans-serif', color: accentColor }}
                    >
                        #{uniform.numero}
                    </div>
                </div>

                {/* Shirt info */}
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-2">
                        <Shirt size={14} />
                        Estampado na camisa
                    </div>
                    <p
                        className="text-white text-xl font-bold uppercase tracking-wide"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        {uniform.camisa}
                    </p>
                </div>
            </div>

            {/* Hover glow effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${accentColor}10 0%, transparent 50%)`
                }}
            />
        </article>
    );
}

export default Uniforms;
