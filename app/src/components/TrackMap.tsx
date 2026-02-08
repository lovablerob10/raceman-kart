import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Info, Flag, CornerUpRight, Activity, FileText } from 'lucide-react';
import { supabase, type Stage } from '../lib/supabase';

interface TrackMapProps {
    stage: Stage;
    onClose: () => void;
}

const TRACK_LAYOUTS: Record<string, string> = {
    'KNO_A': 'M 50,150 L 500,150 C 580,150 580,250 500,250 L 350,250 C 300,250 300,320 350,320 L 450,320 C 500,320 500,380 450,380 L 150,380 C 50,380 50,300 150,250 L 150,200 C 150,150 50,150 50,150 Z',
    'KNO_B': 'M 50,100 L 450,100 C 550,100 550,200 450,200 L 250,200 C 200,200 200,250 250,250 L 500,250 C 550,250 550,350 450,350 L 350,350 C 300,350 300,300 250,300 L 100,300 C 50,300 50,100 50,100 Z',
    'Paulínia': 'M 100,200 C 100,100 200,50 350,50 C 500,50 550,150 500,250 C 450,350 250,380 150,300 C 50,220 100,200 100,200 M 200,150 L 400,150 L 400,250 L 200,250 Z',
    'DEFAULT': 'M 100,200 A 100,50 0 1,1 500,200 A 100,50 0 1,1 100,200'
};

export function TrackMap({ stage, onClose }: TrackMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackPathRef = useRef<SVGPathElement>(null);
    const neonPathRef = useRef<SVGPathElement>(null);

    const trackId = stage.track_id || 'DEFAULT';
    const path = TRACK_LAYOUTS[trackId] || TRACK_LAYOUTS['DEFAULT'];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance animation
            gsap.fromTo('.modal-content',
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
            );

            // Neon trajectory animation
            if (neonPathRef.current) {
                const length = neonPathRef.current.getTotalLength();
                gsap.set(neonPathRef.current, {
                    strokeDasharray: `${length / 10} ${length}`,
                    strokeDashoffset: length
                });

                gsap.to(neonPathRef.current, {
                    strokeDashoffset: 0,
                    duration: 3,
                    repeat: -1,
                    ease: 'none'
                });
            }

            // Isometric tilt float
            gsap.to('.track-svg-container', {
                rotateX: 45,
                rotateZ: -15,
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ perspective: '1000px' }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="modal-content relative w-full max-w-5xl bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col lg:flex-row h-full">

                    {/* Track Visualization Side */}
                    <div className="flex-[1.5] relative min-h-[400px] flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(46,106,156,0.1)_0%,transparent_70%)] overflow-hidden">

                        {/* Grid Pattern Background */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #2e6a9c 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                        <div className="track-svg-container relative w-full h-[60%] flex items-center justify-center will-change-transform">
                            <svg
                                viewBox="0 0 600 400"
                                className="w-[80%] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                fill="none"
                            >
                                <path
                                    d={path}
                                    stroke="#1a1a1a"
                                    strokeWidth="24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    transform="translate(0, 15)"
                                />

                                {/* Main Track Surface */}
                                <path
                                    ref={trackPathRef}
                                    d={path}
                                    stroke="#2E6A9C"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-40"
                                />

                                {/* Inner White Line Decoration */}
                                <path
                                    d={path}
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* THE NEON TRAJECTORY */}
                                <path
                                    ref={neonPathRef}
                                    d={path}
                                    stroke="#F5B500"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ filter: 'drop-shadow(0 0 8px #F5B500)' }}
                                />
                            </svg>

                            {/* Float Indicators */}
                            <div className="absolute top-0 left-0 text-[#F5B500] opacity-20 animate-pulse">
                                <Info size={120} strokeWidth={0.5} />
                            </div>
                        </div>

                        {/* Scale/Compass decoration */}
                        <div className="absolute bottom-8 left-8 flex items-center gap-4 text-white/20 text-xs uppercase tracking-[0.3em]">
                            <div className="w-12 h-px bg-white/20" />
                            <span>3D TRACK SCANNER v2.0</span>
                        </div>
                    </div>

                    {/* Info Side */}
                    <div className="flex-1 bg-[#0d0d12] p-10 lg:p-14 border-l border-white/5">
                        <div className="inline-block px-4 py-1 rounded-full bg-[#F5B500]/10 border border-[#F5B500]/20 text-[#F5B500] text-xs font-black uppercase tracking-widest mb-6">
                            Track Analysis
                        </div>

                        <h3 className="text-5xl font-bold italic text-white uppercase leading-none mb-8" style={{ fontFamily: 'Teko, sans-serif' }}>
                            {stage.name} - {stage.location}
                        </h3>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">
                                    <Flag size={14} className="text-[#F5B500]" />
                                    Extensão
                                </div>
                                <div className="text-3xl font-bold text-white italic" style={{ fontFamily: 'Teko, sans-serif' }}>{stage.track_length || '-'}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">
                                    <CornerUpRight size={14} className="text-[#2E6A9C]" />
                                    Curvas
                                </div>
                                <div className="text-3xl font-bold text-white italic" style={{ fontFamily: 'Teko, sans-serif' }}>{stage.track_corners || '-'}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 col-span-2">
                                <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">
                                    <Activity size={14} className="text-[#F5B500] animate-pulse" />
                                    Recorde da Pista
                                </div>
                                <div className="text-3xl font-bold text-[#F5B500] italic" style={{ fontFamily: 'Teko, sans-serif' }}>{stage.track_record || 'N/A'}</div>
                            </div>
                        </div>

                        <p className="text-gray-500 leading-relaxed mb-10 overflow-hidden text-ellipsis">
                            {stage.track_description || 'Nenhuma descrição técnica disponível para este traçado.'}
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full py-5 bg-[#F5B500] text-black font-black uppercase text-xl italic tracking-widest rounded-2xl hover:bg-[#FFD700] hover:scale-[1.02] transition-all active:scale-95 shadow-[0_15px_30px_rgba(245,181,0,0.2)]"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            FECHAR VISUALIZAÇÃO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
