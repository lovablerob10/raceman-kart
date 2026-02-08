import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleSystem } from '../components/ParticleSystem';
import { TelemetryUI } from '../components/TelemetryUI';
import '../styles/premium.css';

gsap.registerPlugin(ScrollTrigger);

export function HeroPremium() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 100
      });
      gsap.set(imageRef.current, {
        opacity: 0,
        scale: 1.2,
        filter: 'blur(20px)'
      });
      gsap.set(telemetryRef.current, {
        opacity: 0,
        x: 100
      });

      // Master timeline
      const masterTl = gsap.timeline({
        delay: 0.5,
        defaults: { ease: 'power4.out' }
      });

      // Background image reveal
      masterTl.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.5
      });

      // Title animation - word by word with racing inertia
      const titleWords = titleRef.current?.querySelectorAll('.title-word');
      if (titleWords) {
        masterTl.fromTo(titleWords,
          {
            opacity: 0,
            y: 150,
            skewY: 10,
            rotateX: -45
          },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out'
          },
          '-=0.8'
        );
      }

      // Subtitle
      masterTl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.5');

      // CTA buttons
      masterTl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.4');

      // Telemetry panel slide in
      masterTl.to(telemetryRef.current, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.6');

      // Parallax on scroll
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Title parallax (slower)
      gsap.to(titleRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Overlay darkening on scroll
      gsap.to(overlayRef.current, {
        opacity: 0.9,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '50% top',
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
      <div
        ref={imageRef}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/hero-kart.jpg"
          alt="Kart Racing"
          className="w-full h-full object-cover scale-110"
        />
      </div>

      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/50 to-transparent"
      />

      {/* Heat Haze Effect */}
      <ParticleSystem
        containerRef={sectionRef}
        type="heat"
        intensity="low"
        color="#2E6A9C"
        emitFrom="bottom"
      />

      {/* Speed Lines */}
      <div className="speed-lines z-[2]">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="speed-line"
            style={{
              top: `${10 + i * 12}%`,
              width: `${150 + Math.random() * 200}px`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${0.4 + Math.random() * 0.3}s`,
              backgroundColor: i % 2 === 0 ? '#2E6A9C' : '#F5B500'
            }}
          />
        ))}
      </div>

      {/* Carbon Fiber Texture Overlay */}
      <div className="absolute inset-0 z-[3] carbon-fiber opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Season Badge */}
            <div className="inline-flex items-center gap-3 bg-[#2E6A9C]/90 backdrop-blur-sm px-4 py-2 rounded skew-x-[-10deg]">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white font-technical uppercase tracking-widest text-sm skew-x-[10deg]">
                Temporada 2026
              </span>
            </div>

            {/* Main Title */}
            <h1
              ref={titleRef}
              className="f1-heading f1-heading-xl text-white"
              style={{ perspective: '1000px' }}
            >
              <span className="title-word block tracking-tighter">RACEMAN</span>
              <span className="title-word block text-transparent bg-clip-text bg-gradient-to-r from-[#2E6A9C] via-[#2E6A9C] to-[#F5B500]">
                KART RKT
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-white/80 font-technical max-w-lg leading-relaxed"
            >
              A emoção do kartismo profissional.
              <span className="text-[#F5B500]"> Performance extrema</span> nas pistas desde 2006.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 pt-4">
              <button className="group relative px-8 py-4 bg-[#2E6A9C] text-white font-technical uppercase tracking-wider text-lg overflow-hidden skew-x-[-10deg] hover:skew-x-[-5deg] transition-all duration-300">
                <span className="relative z-10 skew-x-[10deg] inline-block">
                  Ver Classificação
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e4669] to-[#2E6A9C] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F5B500]" />
              </button>

              <button className="group px-8 py-4 border-2 border-white/30 text-white font-technical uppercase tracking-wider text-lg skew-x-[-10deg] hover:border-[#F5B500] hover:bg-white/10 transition-all duration-300">
                <span className="skew-x-[10deg] inline-block group-hover:translate-x-1 transition-transform group-hover:text-[#F5B500]">
                  Próxima Etapa →
                </span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex gap-8 pt-6">
              <div>
                <div className="text-4xl font-display font-bold text-white">21</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Edições</div>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <div className="text-4xl font-display font-bold text-[#F5B500]">200+</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Pilotos</div>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <div className="text-4xl font-display font-bold text-white">50K</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Km Corridos</div>
              </div>
            </div>
          </div>

          {/* Right: Telemetry Panel */}
          <div
            ref={telemetryRef}
            className="hidden lg:block"
          >
            <TelemetryUI
              rpm={12500}
              speed={185}
              gear={5}
              lapTime="1:23.456"
              position={1}
              color="#2E6A9C"
            />

            {/* Decorative elements */}
            <div className="mt-6 flex justify-end gap-2">
              <div className="w-16 h-1 bg-[#2E6A9C]" />
              <div className="w-8 h-1 bg-white/30" />
              <div className="w-4 h-1 bg-[#F5B500]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metallic Stripe */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="metallic-stripe" />
        <div className="h-2 bg-gradient-to-r from-[#2E6A9C] via-[#2E6A9C] to-[#F5B500]" />
      </div>

      {/* Corner Accents */}
      <div className="absolute top-20 left-0 w-1 h-32 bg-gradient-to-b from-[#2E6A9C] to-transparent z-20" />
      <div className="absolute bottom-20 right-0 w-1 h-32 bg-gradient-to-t from-[#2E6A9C] to-transparent z-20" />
    </section>
  );
}

export default HeroPremium;
