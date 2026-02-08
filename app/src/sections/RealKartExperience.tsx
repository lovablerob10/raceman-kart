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
          className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-500 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)'
          }}
        >
          <div
            ref={titleRef}
            className="text-center px-4"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600 px-4 py-2 rounded mb-6 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white font-mono text-sm uppercase tracking-wider">
                Experiência Imersiva
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-5xl md:text-7xl lg:text-8xl font-bold italic text-white mb-4 drop-shadow-lg"
              style={{
                fontFamily: 'Teko, sans-serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
              }}
            >
              SENSAÇÃO DE
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                VELOCIDADE
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl text-white/90 font-technical max-w-2xl mx-auto mb-8"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            >
              Role para baixo e controle a experiência.
              Sinta a adrenalina de um kart de verdade em alta velocidade.
            </p>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 bg-black/30">
                <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" />
              </div>
              <span className="text-white/80 text-sm font-mono bg-black/50 px-3 py-1 rounded">
                SCROLL PARA ACELERAR
              </span>
            </div>
          </div>
        </div>

        {/* 4. HUD Elements (Visible during scroll) */}

        {/* Speed Indicator */}
        <div className="absolute bottom-8 left-8 z-20">
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Velocidade</div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl md:text-5xl font-bold text-white font-mono tabular-nums"
                style={{
                  color: telemetry.speed > 120 ? '#ff4444' : telemetry.speed > 60 ? '#ffaa00' : '#44ff44',
                  textShadow: telemetry.speed > 100 ? '0 0 20px currentColor' : 'none'
                }}
              >
                {telemetry.speed}
              </span>
              <span className="text-white/50 text-sm">KM/H</span>
            </div>
            <div className="mt-2 w-32 md:w-40 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${(telemetry.speed / 180) * 100}%`,
                  background: `linear-gradient(90deg, #44ff44 0%, #ffaa00 50%, #ff4444 100%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Gear Indicator */}
        <div className="absolute bottom-8 right-8 z-20">
          <div
            className="p-4 rounded-lg text-center"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Marcha</div>
            <div
              className="text-5xl md:text-6xl font-bold"
              style={{
                fontFamily: 'Teko, sans-serif',
                color: telemetry.gear === '6' ? '#ff4444' : '#ffffff',
                textShadow: telemetry.gear === '6' ? '0 0 20px #ff4444' : 'none'
              }}
            >
              {telemetry.gear}
            </div>
          </div>
        </div>

        {/* Side Info Panel */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20 hidden lg:block">
          <div
            className="space-y-4 p-4 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="text-right">
              <div className="text-[10px] text-white/50 uppercase tracking-wider">RPM</div>
              <div
                className="text-2xl font-mono tabular-nums"
                style={{
                  color: telemetry.rpm > 12000 ? '#ff4444' : '#ffffff'
                }}
              >
                {telemetry.rpm.toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Turbo</div>
              <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden ml-auto">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-100"
                  style={{ width: `${telemetry.turbo}%` }}
                />
              </div>
              <div className="text-xs text-blue-400 mt-1">{telemetry.turbo}%</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Temperatura</div>
              <div className="text-xl font-mono text-orange-400">
                {Math.round(85 + telemetry.progress * 40)}°C
              </div>
            </div>

            <div className="text-right pt-2 border-t border-white/10">
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Progresso</div>
              <div className="text-lg font-mono text-white">
                {Math.round(telemetry.progress * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div
            className="h-1 bg-white/20"
            style={{ width: '100%' }}
          >
            <div
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 transition-all duration-100"
              style={{ width: `${telemetry.progress * 100}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default RealKartExperience;
