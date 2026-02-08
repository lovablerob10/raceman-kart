import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleSystem } from '../components/ParticleSystem';

gsap.registerPlugin(ScrollTrigger);

/**
 * KartExperience - Seção imersiva com animação de kart
 * sincronizada ao scroll, simulando uma experiência de vídeo
 */
export function KartExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const kartRef = useRef<HTMLDivElement>(null);
  const speedLinesRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const kart = kartRef.current;
    const speedLines = speedLinesRef.current;
    const telemetry = telemetryRef.current;
    if (!section || !track || !kart || !speedLines || !telemetry) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(kart, { x: '-100%', opacity: 0 });
      gsap.set(speedLines.children, { opacity: 0 });

      // Master scroll timeline - pinned section
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.8,
          snap: {
            snapTo: (progress) => {
              if (progress < 0.2) return 0;
              if (progress < 0.4) return 0.33;
              if (progress < 0.6) return 0.66;
              return 1;
            },
            duration: { min: 0.2, max: 0.5 },
            delay: 0.1,
            ease: 'power2.inOut'
          },
          onUpdate: (self) => {
            progressRef.current = self.progress;
            
            // Update telemetry based on progress
            const rpm = Math.round(3000 + self.progress * 12000);
            const speed = Math.round(50 + self.progress * 200);
            
            const rpmEl = telemetry.querySelector('.telemetry-rpm');
            const speedEl = telemetry.querySelector('.telemetry-speed');
            
            if (rpmEl) rpmEl.textContent = rpm.toLocaleString();
            if (speedEl) speedEl.textContent = speed.toString();
          }
        }
      });

      // Phase 1: Kart enters and accelerates (0-33%)
      scrollTl.fromTo(kart,
        { x: '-100%', opacity: 0, scale: 0.8 },
        { x: '10%', opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      // Speed lines appear
      scrollTl.to(speedLines.children, {
        opacity: 1,
        stagger: 0.02,
        duration: 0.1
      }, 0);

      // Phase 2: Full speed cruising (33-66%)
      scrollTl.to(kart, {
        x: '50%',
        ease: 'none'
      }, 0.33);

      // Add vibration at high speed
      scrollTl.to(kart, {
        y: '+=2',
        duration: 0.05,
        yoyo: true,
        repeat: 10,
        ease: 'none'
      }, 0.4);

      // Phase 3: Brake and exit (66-100%)
      scrollTl.to(kart, {
        x: '120%',
        opacity: 0,
        scale: 0.9,
        ease: 'power2.in'
      }, 0.66);

      // Speed lines fade
      scrollTl.to(speedLines.children, {
        opacity: 0,
        stagger: 0.01,
        duration: 0.1
      }, 0.7);

      // Track movement (parallax)
      gsap.to(track, {
        backgroundPosition: '-100% 0',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          scrub: true
        }
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black"
    >
      {/* Track Background */}
      <div 
        ref={trackRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, 
              #1a1a1a 0%, #1a1a1a 45%, 
              #333 45%, #333 55%, 
              #1a1a1a 55%, #1a1a1a 100%
            )
          `,
          backgroundSize: '200px 100%',
        }}
      >
        {/* Track markings */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-yellow-400/50" />
        <div 
          className="absolute top-1/2 left-0 right-0 h-px"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, white 0, white 50px, transparent 50px, transparent 100px)'
          }}
        />
      </div>

      {/* Speed Lines */}
      <div ref={speedLinesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
              top: `${10 + (i * 6)}%`,
              left: '-100%',
              width: '200px',
              animation: `speed-line ${0.3 + Math.random() * 0.2}s linear infinite`,
              animationDelay: `${i * 0.05}s`
            }}
          />
        ))}
      </div>

      {/* Tire Smoke */}
      <ParticleSystem 
        containerRef={sectionRef}
        type="smoke"
        intensity="medium"
        color="#888888"
        emitFrom="bottom"
      />

      {/* Kart */}
      <div 
        ref={kartRef}
        className="absolute top-1/2 -translate-y-1/2 z-10 will-change-transform"
        style={{ width: '400px', height: '200px' }}
      >
        {/* Kart SVG */}
        <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-2xl">
          {/* Shadow */}
          <ellipse cx="200" cy="180" rx="180" ry="20" fill="rgba(0,0,0,0.5)" />
          
          {/* Rear wing */}
          <rect x="20" y="60" width="40" height="80" fill="#E10600" rx="5" />
          <rect x="15" y="50" width="50" height="10" fill="#C0C0C0" rx="2" />
          
          {/* Main body */}
          <path 
            d="M60 100 Q80 80 150 75 L280 80 Q350 85 380 100 L370 130 Q300 140 200 140 Q100 140 70 130 Z" 
            fill="#E10600"
          />
          
          {/* Cockpit */}
          <ellipse cx="180" cy="95" rx="50" ry="25" fill="#0D0D0D" />
          
          {/* Driver helmet */}
          <circle cx="180" cy="90" r="20" fill="#FFFFFF" />
          <path d="M165 85 Q180 75 195 85" stroke="#E10600" strokeWidth="3" fill="none" />
          
          {/* Front wing */}
          <path d="M350 110 L390 105 L395 115 L355 125 Z" fill="#C0C0C0" />
          
          {/* Wheels */}
          <circle cx="80" cy="150" r="35" fill="#1a1a1a" stroke="#C0C0C0" strokeWidth="3" />
          <circle cx="80" cy="150" r="20" fill="#333" />
          <circle cx="80" cy="150" r="8" fill="#E10600" />
          
          <circle cx="320" cy="150" r="35" fill="#1a1a1a" stroke="#C0C0C0" strokeWidth="3" />
          <circle cx="320" cy="150" r="20" fill="#333" />
          <circle cx="320" cy="150" r="8" fill="#E10600" />
          
          {/* Number */}
          <text x="250" y="115" fontFamily="Teko" fontSize="40" fill="#FFFFFF" fontWeight="bold" fontStyle="italic">
            07
          </text>
          
          {/* Sparks from bottom */}
          <g className="sparks">
            {[...Array(5)].map((_, i) => (
              <circle 
                key={i}
                cx={100 + i * 50} 
                cy="170" 
                r="2" 
                fill="#FFD700"
                style={{
                  animation: `spark-fly 0.5s ease-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Telemetry Overlay */}
      <div 
        ref={telemetryRef}
        className="absolute bottom-8 left-8 z-20 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 font-mono"
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">RPM</div>
            <div className="telemetry-rpm text-2xl font-bold text-red-500 tabular-nums">
              3,000
            </div>
          </div>
          <div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">SPEED</div>
            <div className="flex items-baseline">
              <span className="telemetry-speed text-2xl font-bold text-white tabular-nums">
                50
              </span>
              <span className="ml-1 text-sm text-white/50">KM/H</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 rounded-full"
            style={{ 
              width: `${progressRef.current * 100}%`,
              transition: 'width 0.1s linear'
            }}
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="absolute top-8 right-8 z-20 text-right">
        <h2 
          className="text-4xl md:text-6xl font-bold italic text-white/90"
          style={{ fontFamily: 'Teko, sans-serif' }}
        >
          EXPERIÊNCIA
        </h2>
        <p className="text-red-500 font-mono text-sm tracking-wider">
          SCROLL PARA ACELERAR
        </p>
      </div>

      <style>{`
        @keyframes speed-line {
          0% { transform: translateX(-100vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        
        @keyframes spark-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-30px, -20px) scale(0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

export default KartExperience;
