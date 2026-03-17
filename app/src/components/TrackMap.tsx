import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Flag, CornerUpRight, Activity, Lock, Calendar } from 'lucide-react';
import { type Stage } from '../lib/supabase';

interface TrackMapProps {
    stage: Stage;
    onClose: () => void;
}

// Map of track IDs that have a real uploaded image
const TRACK_IMAGES: Record<string, string> = {
    'KNO_B': '/images/tracks/KNO_B.jpeg',
};

// Check if a track has a real image uploaded
function hasTrackImage(trackId: string | undefined): boolean {
    return !!trackId && !!TRACK_IMAGES[trackId];
}

export function TrackMap({ stage, onClose }: TrackMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const trackId = stage.track_id || 'DEFAULT';
    const trackImage = TRACK_IMAGES[trackId];
    const isTrackDefined = hasTrackImage(trackId);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance animation
            gsap.fromTo('.modal-content',
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
            );

            // Subtle float on image container
            if (isTrackDefined) {
                gsap.to('.track-image-container', {
                    y: -8,
                    duration: 2.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut'
                });
            }

            // Pulse glow for placeholder
            if (!isTrackDefined) {
                gsap.to('.placeholder-glow', {
                    opacity: 0.6,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [isTrackDefined]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
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
                    <div className="flex-[1.5] relative min-h-[400px] flex items-center justify-center bg-black overflow-hidden">

                        {isTrackDefined ? (
                            /* Real Track Image */
                            <div className="track-image-container relative w-full h-full flex items-center justify-center p-8">
                                <img
                                    src={trackImage}
                                    alt={`Traçado ${stage.name} - ${stage.location}`}
                                    className="w-full h-full object-contain max-h-[450px] drop-shadow-[0_0_40px_rgba(245,181,0,0.15)]"
                                />
                                {/* Subtle corner vignette */}
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                            </div>
                        ) : (
                            /* Placeholder - Pista não definida */
                            <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F5B500 0, #F5B500 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

                                {/* Glow */}
                                <div className="placeholder-glow absolute w-48 h-48 rounded-full bg-[#F5B500]/10 blur-3xl opacity-30" />

                                {/* Lock Icon */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Lock size={36} className="text-white/20" />
                                    </div>
                                </div>

                                {/* Text */}
                                <h4
                                    className="text-3xl md:text-4xl font-bold italic text-white/30 uppercase tracking-wider text-center mb-3"
                                    style={{ fontFamily: 'Teko, sans-serif' }}
                                >
                                    PISTA NÃO DEFINIDA
                                </h4>
                                <p className="text-white/15 text-sm text-center max-w-[280px] leading-relaxed">
                                    O traçado será revelado um dia antes da corrida
                                </p>

                                {/* Calendar hint */}
                                <div className="mt-6 flex items-center gap-2 text-white/10 text-xs uppercase tracking-widest">
                                    <Calendar size={14} />
                                    <span>Aguarde a definição</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info Side */}
                    <div className="flex-1 bg-[#0d0d12] p-10 lg:p-14 border-l border-white/5">
                        <div className="inline-block px-4 py-1 rounded-full bg-[#F5B500]/10 border border-[#F5B500]/20 text-[#F5B500] text-xs font-black uppercase tracking-widest mb-6">
                            Track Analysis
                        </div>

                        <h3 className="text-5xl font-bold italic text-white uppercase leading-none mb-8" style={{ fontFamily: 'Teko, sans-serif' }}>
                            {stage.name} - {stage.location}
                        </h3>

                        {isTrackDefined ? (
                            /* Show track stats only when track has image */
                            <>
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
                            </>
                        ) : (
                            /* Placeholder info when track is not defined */
                            <div className="mb-12">
                                <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#F5B500]/10 flex items-center justify-center">
                                            <Lock size={18} className="text-[#F5B500]/50" />
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-sm font-bold uppercase tracking-wider">Dados Indisponíveis</p>
                                            <p className="text-white/20 text-xs">Extensão · Curvas · Recorde</p>
                                        </div>
                                    </div>
                                    <p className="text-white/15 text-sm leading-relaxed">
                                        As informações técnicas do traçado serão liberadas junto com a definição da pista, um dia antes da corrida.
                                    </p>
                                </div>
                            </div>
                        )}

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
