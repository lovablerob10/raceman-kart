import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin } from 'lucide-react';
import { ParticleSystem } from '../components/ParticleSystem';
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
              <button
                onClick={() => document.getElementById('standings')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-[#2E6A9C] text-white font-technical uppercase tracking-wider text-lg overflow-hidden skew-x-[-10deg] hover:skew-x-[-5deg] transition-all duration-300"
              >
                <span className="relative z-10 skew-x-[10deg] inline-block">
                  Ver Classificação
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e4669] to-[#2E6A9C] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F5B500]" />
              </button>

              <button
                onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 border-2 border-white/30 text-white font-technical uppercase tracking-wider text-lg skew-x-[-10deg] hover:border-[#F5B500] hover:bg-white/10 transition-all duration-300"
              >
                <span className="skew-x-[10deg] inline-block group-hover:translate-x-1 transition-transform group-hover:text-[#F5B500]">
                  Próxima Etapa →
                </span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex gap-8 pt-6">
              <div>
                <div className="text-4xl font-display font-bold text-white">12</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Edições</div>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <div className="text-4xl font-display font-bold text-[#F5B500]">22</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Pilotos</div>
              </div>

            </div>
          </div>

          {/* Right: Telemetry Panel */}
          <div
            ref={telemetryRef}
            className="hidden lg:block"
          >
            {/* HIGH-IMPACT PROXIMA ETAPA PANEL (Substitutes Telemetry) */}
            <div className="relative group perspective-1000 mt-12 lg:mt-0">
              {/* Outer Glow / Shadow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F5B500] to-[#2E6A9C] rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />

              <div className="relative bg-gradient-to-br from-[#0a0f16] to-[#121c26] border border-white/10 rounded-2xl overflow-hidden shadow-2xl skew-x-[-5deg] transform-style-3d group-hover:-rotate-x-2 transition-transform duration-500">

                {/* Background Track/Texture Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
                  <div className="absolute right-0 top-0 w-64 h-64 bg-[#2E6A9C] rounded-full blur-[80px] -mr-20 -mt-20 mix-blend-screen" />
                  <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#F5B500] rounded-full blur-[80px] -ml-20 -mb-20 mix-blend-screen" />
                </div>

                {/* Top Banner: Status */}
                <div className="bg-gradient-to-r from-[#F5B500] to-[#d49d00] px-6 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    <span className="text-black font-technical font-bold tracking-widest text-sm uppercase">Próxima Etapa</span>
                  </div>
                  <span className="text-black/80 font-black font-display tracking-wider">02 / 12</span>
                </div>

                {/* Main Content */}
                <div className="p-8 relative z-10 flex gap-6 items-center">

                  {/* Left: Huge Date Block */}
                  <div className="flex flex-col items-center justify-center border-r border-white/10 pr-6">
                    <span className="text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-none drop-shadow-lg">15</span>
                    <span className="text-[#F5B500] font-technical tracking-widest uppercase text-xl mt-1">Mar</span>
                  </div>

                  {/* Right: Info details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-3xl font-display text-white uppercase tracking-wider mb-1" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        KNO <span className="text-[#2E6A9C]">Nova Odessa</span>
                      </h3>
                      <p className="text-white/60 font-technical text-sm tracking-widest uppercase flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#F5B500]" />
                        Kartódromo Nova Odessa
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 flex flex-col">
                        <span className="text-[#F5B500] text-xs font-technical uppercase">Layout</span>
                        <span className="text-white font-bold text-sm">Traçado B (Inv)</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 flex flex-col">
                        <span className="text-[#F5B500] text-xs font-technical uppercase">Sessão</span>
                        <span className="text-white font-bold text-sm">08:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action Bottom */}
                <div className="px-8 pb-8 relative z-10">
                  <button
                    onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group/btn relative w-full overflow-hidden rounded-lg bg-[#2E6A9C] text-white font-technical py-4 uppercase tracking-widest text-lg transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(46,106,156,0.3)] hover:shadow-[0_0_30px_rgba(46,106,156,0.6)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#21527c] to-[#3a82bf] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    {/* Swipe metallic effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Visualizar no Calendário
                    </span>
                  </button>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="h-1.5 w-full flex">
                  <div className="w-1/3 bg-[#F5B500]" />
                  <div className="w-2/3 bg-[#2E6A9C]" />
                </div>
              </div>
            </div>

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
