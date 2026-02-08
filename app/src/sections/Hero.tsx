import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, Trophy } from 'lucide-react';
import { AnimatedKart } from '../components/AnimatedKart';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const checkeredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Badge animation
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'back.out(1.7)'
        }
      );

      // Title animation - word by word
      const titleWords = titleRef.current?.querySelectorAll('.title-word');
      if (titleWords) {
        gsap.fromTo(
          titleWords,
          { opacity: 0, y: 80, rotationX: -90 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.5,
            ease: 'power3.out'
          }
        );
      }

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 1,
          ease: 'power3.out'
        }
      );

      // Buttons animation
      const buttons = buttonsRef.current?.querySelectorAll('button');
      if (buttons) {
        gsap.fromTo(
          buttons,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 1.2,
            ease: 'back.out(1.7)'
          }
        );
      }

      // Checkered flag wave animation
      gsap.to(checkeredRef.current, {
        backgroundPosition: '20px 0',
        duration: 0.5,
        repeat: -1,
        ease: 'none'
      });

      // Parallax effect on background
      gsap.to('.hero-bg-image', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&q=80"
          alt="High speed kart racing action"
          className="hero-bg-image w-full h-full object-cover scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E6A9C]/95 via-[#2E6A9C]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Animated Kart */}
      <AnimatedKart
        containerRef={sectionRef}
        direction="left-to-right"
        color="#F5B500"
      />

      {/* Speed lines decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              width: '200px',
              top: `${20 + i * 15}%`,
              left: '-200px',
              animation: `speed-line ${2 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-20">
        <div className="max-w-3xl">
          {/* Season Badge */}
          <div
            ref={badgeRef}
            className="inline-block mb-6"
          >
            <div
              className="px-6 py-2 bg-[#F5B500] text-black font-display uppercase text-xl -skew-x-12 transform shadow-lg"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              <span className="block skew-x-12 flex items-center gap-2">
                <Trophy size={20} />
                Temporada 2026
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase italic leading-none mb-6"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            <span className="title-word block">Velocidade</span>
            <span className="title-word block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5B500] via-[#FFD700] to-[#2E6A9C]">
                Pura & Emoção
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-gray-200 text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
          >
            Acompanhe o campeonato mais disputado da região. Calendário completo,
            classificação atualizada e todas as notícias do RKT Raceman Kart.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4">
            <button
              className="group bg-[#F5B500] hover:bg-[#FFD700] text-black font-display uppercase text-xl md:text-2xl px-8 py-3 rounded skew-x-[-10deg] transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F5B500]/30"
              style={{ fontFamily: 'Teko, sans-serif' }}
              onClick={() => document.querySelector('#standings')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="block skew-x-[10deg] flex items-center gap-2">
                Ver Classificação
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              className="group border-2 border-white/70 hover:border-white hover:bg-white hover:text-[#2E6A9C] text-white font-display uppercase text-xl md:text-2xl px-8 py-3 rounded skew-x-[-10deg] transform transition-all duration-300 hover:-translate-y-1"
              style={{ fontFamily: 'Teko, sans-serif' }}
              onClick={() => document.querySelector('#calendar')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="block skew-x-[10deg] flex items-center gap-2">
                Próxima Etapa
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkered flag bottom border */}
      <div
        ref={checkeredRef}
        className="absolute bottom-0 left-0 right-0 h-6 z-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #000 25%, transparent 25%),
            linear-gradient(-45deg, #000 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #000 75%),
            linear-gradient(-45deg, transparent 75%, #000 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          opacity: 0.7
        }}
      />

      {/* Side decorations */}
      <div className="absolute left-0 top-1/3 w-2 h-32 bg-gradient-to-b from-[#F5B500] to-transparent z-20" />
      <div className="absolute right-0 bottom-1/3 w-2 h-32 bg-gradient-to-t from-[#F5B500] to-transparent z-20" />

      <style>{`
        @keyframes speed-line {
          0% {
            transform: translateX(-100vw);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
