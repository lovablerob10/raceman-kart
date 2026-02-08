import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ParticleSystem } from './ParticleSystem';

interface CinematicIntroProps {
  onComplete?: () => void;
  skipOnScroll?: boolean;
}

/**
 * CinematicIntro - Animação de introdução estilo F1/cinema
 * Com revelação do logo, partículas e efeitos dramáticos
 */
export function CinematicIntro({ onComplete, skipOnScroll = true }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (isComplete || isSkipped) return;

    const container = containerRef.current;
    if (!container) return;

    // Master timeline
    const masterTl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        onComplete?.();
      }
    });

    // Phase 1: Black screen with engine sound visualization (0-1s)
    masterTl.fromTo('.engine-viz',
      { scaleY: 0 },
      { scaleY: 1, duration: 0.3, ease: 'power2.out' }
    );

    // Phase 2: Red flash (1-1.5s)
    masterTl.to('.red-flash', {
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    }, '+=0.5');

    masterTl.to('.red-flash', {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Phase 3: Logo reveal with glitch effect (1.5-3s)
    masterTl.fromTo(logoRef.current,
      {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(20px)'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power4.out'
      },
      '-=0.2'
    );

    // Glitch effect on logo
    masterTl.to(logoRef.current, {
      x: 5,
      duration: 0.05,
      ease: 'none'
    });
    masterTl.to(logoRef.current, {
      x: -5,
      duration: 0.05,
      ease: 'none'
    });
    masterTl.to(logoRef.current, {
      x: 0,
      duration: 0.05,
      ease: 'none'
    });

    // Phase 4: Tagline appears (3-4s)
    masterTl.fromTo(taglineRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    );

    // Phase 5: Hold and fade out (4-5.5s)
    masterTl.to([logoRef.current, taglineRef.current], {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power2.in',
      delay: 1
    });

    masterTl.to(container, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(container, { display: 'none' });
      }
    });

    // Skip on scroll
    if (skipOnScroll) {
      const handleScroll = () => {
        if (!isComplete && !isSkipped) {
          setIsSkipped(true);
          masterTl.kill();
          gsap.to(container, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              gsap.set(container, { display: 'none' });
              onComplete?.();
            }
          });
        }
      };

      window.addEventListener('scroll', handleScroll, { once: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        masterTl.kill();
      };
    }

    return () => {
      masterTl.kill();
    };
  }, [isComplete, isSkipped, onComplete, skipOnScroll]);

  if (isComplete || isSkipped) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Engine Sound Visualization */}
      <div className="engine-viz absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-[#2E6A9C] origin-bottom"
            style={{
              height: `${20 + Math.random() * 60}px`,
              animation: `engine-pulse 0.1s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.02}s`
            }}
          />
        ))}
      </div>

      {/* Blue Flash */}
      <div className="red-flash absolute inset-0 bg-[#2E6A9C] opacity-0 pointer-events-none" />

      {/* Particle Effects */}
      <ParticleSystem
        containerRef={containerRef}
        type="sparks"
        intensity="high"
        color="#F5B500"
        emitFrom="center"
      />

      {/* Logo */}
      <div
        ref={logoRef}
        className="relative z-10 text-center overflow-visible px-8"
        style={{ perspective: '1000px' }}
      >
        <div className="relative overflow-visible flex flex-col items-center">
          {/* Glow effect */}
          <div className="absolute inset-0 blur-3xl bg-[#2E6A9C]/30 scale-150" />

          {/* New Logo Image */}
          <img
            src="/images/logo-rkt-transparent.webp"
            alt="RKT Raceman Kart"
            className="h-32 md:h-48 lg:h-64 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(46,106,156,0.5)]"
          />

          {/* Racing stripe under logo */}
          <div className="mt-8 w-64 h-1 bg-gradient-to-r from-transparent via-[#F5B500] to-transparent" />
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          className="mt-8 opacity-0"
        >
          <p className="text-xl md:text-2xl text-white/80 font-technical uppercase tracking-[0.3em]">
            RKT RACEMAN KART
          </p>
          <p className="mt-2 text-[#F5B500] font-mono text-sm tracking-wider">
            PERFORMANCE • SPEED • EMOTION
          </p>
        </div>
      </div>

      {/* Skip hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-sm animate-pulse">
        Scroll para pular →
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#2E6A9C]/50" />
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-[#2E6A9C]/50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-[#2E6A9C]/50" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-[#2E6A9C]/50" />

      <style>{`
        @keyframes engine-pulse {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default CinematicIntro;
