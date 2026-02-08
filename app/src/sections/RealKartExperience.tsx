import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RealKartVideo } from '../components/RealKartVideo';
import { useScrollAudio } from '../hooks/useScrollAudio';

gsap.registerPlugin(ScrollTrigger);

/**
 * RealKartExperience - Seção imersiva com vídeo Remotion
 * Controlado pelo scroll do usuário com sync frame-a-frame
 */
export function RealKartExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(true);
  const showContentRef = useRef(true); // Ref tracking for stable closure access

  const [telemetry, setTelemetry] = useState({
    speed: 0,
    rpm: 0,
    gear: 'N',
    turbo: 0,
    progress: 0
  });

  // Enable Audio - synced with scroll progress
  useScrollAudio(telemetry.progress);

  // Update telemetry based on scroll progress
  const updateTelemetry = useCallback((progress: number) => {
    // Calculate speed (parabolic curve - faster in middle)
    const speed = Math.round(progress < 0.5
      ? progress * 2 * 180
      : (1 - progress) * 2 * 180);

    // Calculate RPM
    const rpm = Math.round(1000 + progress * 14000);

    // Calculate gear
    const gear = progress < 0.15 ? '1' :
      progress < 0.3 ? '2' :
        progress < 0.5 ? '3' :
          progress < 0.7 ? '4' :
            progress < 0.85 ? '5' : '6';

    setTelemetry({
      speed,
      rpm,
      gear,
      turbo: Math.round(progress * 100),
      progress
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const ctx = gsap.context(() => {
      // Title animation (Initial)
      gsap.fromTo(title,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Scroll trigger for content visibility and progress
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=400%',
        scrub: 0.5, // Add scrub for smoother updates
        onUpdate: (self) => {
          const progress = self.progress;

          // Update telemetry for RealKartVideo
          updateTelemetry(progress);

          // Hide/show title based on progress using Ref to prevent closure staleness
          if (progress > 0.15 && showContentRef.current) {
            gsap.to(title, { opacity: 0, y: -50, duration: 0.3 });
            setShowContent(false);
            showContentRef.current = false;
          } else if (progress <= 0.15 && !showContentRef.current) {
            gsap.to(title, { opacity: 1, y: 0, duration: 0.3 });
            setShowContent(true);
            showContentRef.current = true;
          }
        }
      });

    }, section);

    return () => ctx.revert();
  }, [updateTelemetry]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[500vh] bg-black"
    >
      {/* Sticky Container - Holds everything that stays on screen during scroll */}
      <div className="sticky top-0 h-screen z-[5] overflow-hidden">

        {/* 1. The Video Layer */}
        <RealKartVideo
          progress={telemetry.progress}
          className="w-full h-full"
        />

        {/* 2. Brightness Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
          }}
        />

        {/* 3. Title/Intro Overlay (Fades out) */}
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-700 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        >
          <div
            ref={titleRef}
            className="text-center px-4"
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-[#F5B500]/20 border border-[#F5B500]/40 px-6 py-2 rounded-full mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(245,181,0,0.3)]">
              <span className="w-2.5 h-2.5 bg-[#F5B500] rounded-full animate-ping" />
              <span className="text-white font-display text-lg uppercase font-black tracking-[0.3em]" style={{ fontFamily: 'Teko, sans-serif' }}>
                Experiência Imersiva 360°
              </span>
            </div>

            {/* Cinematic Title */}
            <h2
              className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase italic text-white mb-6 leading-none tracking-tighter"
              style={{
                fontFamily: 'Teko, sans-serif',
                textShadow: '0 10px 40px rgba(0,0,0,0.9)'
              }}
            >
              <span className="block opacity-80">SENSAÇÃO DE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F5B500] via-[#FFD700] to-[#2E6A9C] drop-shadow-[0_0_30px_rgba(245,181,0,0.5)]">
                PURA ADRENALINA
              </span>
            </h2>

            {/* Cinematic Subtitle */}
            <p
              className="text-xl md:text-2xl text-white/70 font-display font-medium max-w-3xl mx-auto mb-12 uppercase italic tracking-wide"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              Acelere a fundo. Controle cada curva. Sinta o asfalto.
              O controle está <span className="text-white font-black underline decoration-[#F5B500]">no seu scroll</span>.
            </p>

            {/* Premium Scroll indicator */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-1 h-32 bg-gradient-to-b from-transparent via-[#F5B500] to-transparent animate-[scroll-line_2s_infinite]" />
              <div className="relative">
                <div className="absolute inset-0 bg-[#F5B500] blur-xl opacity-20 animate-pulse" />
                <span className="relative z-10 text-white font-display text-2xl font-black uppercase italic tracking-[0.5em] border border-white/20 px-8 py-2 rounded-lg backdrop-blur-xl" style={{ fontFamily: 'Teko, sans-serif' }}>
                  SCROLL PARA ACELERAR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. PREMIUM HUD Elements (Visible during scroll) */}

        {/* Speed Indicator - Glassmorphism style */}
        <div className="absolute bottom-12 left-12 z-20">
          <div
            className="p-6 rounded-[2rem] border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 bg-[#F5B500]" />
              <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">Velocidade Atual</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-6xl md:text-8xl font-display font-black italic tabular-nums leading-none tracking-tighter"
                style={{
                  fontFamily: 'Teko, sans-serif',
                  color: telemetry.speed > 140 ? '#F5B500' : telemetry.speed > 80 ? '#FFD700' : '#ffffff',
                  textShadow: telemetry.speed > 120 ? '0 0 30px rgba(245, 181, 0, 0.5)' : 'none'
                }}
              >
                {telemetry.speed}
              </span>
              <span className="text-[#F5B500] text-xl font-display font-black italic" style={{ fontFamily: 'Teko, sans-serif' }}>KM/H</span>
            </div>
            <div className="mt-4 w-40 md:w-56 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${(telemetry.speed / 180) * 100}%`,
                  background: `linear-gradient(90deg, #2E6A9C 0%, #F5B500 100%)`,
                  boxShadow: '0 0 10px rgba(245, 181, 0, 0.5)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Gear Indicator - Floating Bold */}
        <div className="absolute bottom-12 right-12 z-20">
          <div
            className="p-8 rounded-[2rem] text-center border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }}
          >
            <div className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em] mb-2">MARCHA</div>
            <div
              className="text-7xl md:text-9xl font-display font-black leading-none italic"
              style={{
                fontFamily: 'Teko, sans-serif',
                color: telemetry.gear === '6' ? '#F5B500' : '#ffffff',
                textShadow: telemetry.gear === '6' ? '0 0 30px #F5B500' : '0 0 20px rgba(255,255,255,0.2)'
              }}
            >
              {telemetry.gear}
            </div>
          </div>
        </div>

        {/* Side Info Panel - Tech Grid style */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 z-20 hidden lg:block">
          <div
            className="space-y-6 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{
              background: 'rgba(5, 5, 5, 0.4)',
            }}
          >
            <div>
              <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">MOTOR RPM</div>
              <div
                className="text-4xl font-display font-black italic tracking-tight italic"
                style={{
                  fontFamily: 'Teko, sans-serif',
                  color: telemetry.rpm > 13000 ? '#F5B500' : '#ffffff'
                }}
              >
                {telemetry.rpm.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-2">OVERBOOST TURBO</div>
              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#2E6A9C] to-cyan-400 rounded-full transition-all duration-100"
                  style={{
                    width: `${telemetry.turbo}%`,
                    boxShadow: '0 0 15px rgba(0, 191, 255, 0.4)'
                  }}
                />
              </div>
              <div className="text-right text-xs text-cyan-400 mt-1 font-mono font-bold">{telemetry.turbo}%</div>
            </div>

            <div className="flex justify-between items-end gap-6 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">TRACK TEMP</div>
                <div className="text-2xl font-display font-bold text-[#F5B500] italic" style={{ fontFamily: 'Teko, sans-serif' }}>
                  {Math.round(85 + telemetry.progress * 40)}°C
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">LAP PROGRESS</div>
                <div className="text-2xl font-display font-bold text-white italic" style={{ fontFamily: 'Teko, sans-serif' }}>
                  {Math.round(telemetry.progress * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Progress line - Cyber style */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="h-2 bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2E6A9C] via-[#F5B500] to-[#FFD700] brightness-150 shadow-[0_0_20px_#F5B500]"
              style={{ width: `${telemetry.progress * 100}%` }}
            />
          </div>
        </div>


      </div>
    </section>
  );
}

export default RealKartExperience;
