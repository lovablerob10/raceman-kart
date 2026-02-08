import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fuel, Wrench, Shield, Gauge, Flag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const sponsors = [
  { name: 'RACING CO', icon: Flag, color: '#2E6A9C' },
  { name: 'FUEL UP', icon: Fuel, color: '#22c55e' },
  { name: 'MECHANIX', icon: Wrench, color: '#3b82f6' },
  { name: 'SECURE TIRES', icon: Shield, color: '#ef4444' },
  { name: 'SPEEDOMETER', icon: Gauge, color: '#f59e0b' },
];

export function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sponsorsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true
          }
        }
      );

      // Sponsors stagger animation
      const items = sponsorsRef.current?.querySelectorAll('.sponsor-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: sponsorsRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );
      }

      // Banner animation
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top 90%',
            once: true
          }
        }
      );

      // Infinite scroll animation for sponsors on hover
      const sponsorContainer = sponsorsRef.current;
      if (sponsorContainer && items && items.length > 0) {
        sponsorContainer.addEventListener('mouseenter', () => {
          gsap.to(Array.from(items), {
            x: -10,
            duration: 0.3,
            stagger: 0.05,
            yoyo: true,
            repeat: 1
          });
        });
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="py-16 md:py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Label */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-12 bg-white/20" />
          <h3
            ref={titleRef}
            className="text-xl md:text-2xl font-display uppercase font-black text-white/40 tracking-[0.4em]"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            Patrocinadores Oficiais
          </h3>
          <div className="h-px w-12 bg-white/20" />
        </div>

        {/* Premium Sponsors Grid */}
        <div
          ref={sponsorsRef}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mb-20"
        >
          {sponsors.map((sponsor) => {
            const Icon = sponsor.icon;
            return (
              <div
                key={sponsor.name}
                className="sponsor-item group relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 cursor-pointer transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                {/* Sponsor Icon with colored glow */}
                <div
                  className="p-3 rounded-xl transition-all duration-500 group-hover:scale-110"
                  style={{
                    backgroundColor: `${sponsor.color}15`,
                    boxShadow: `0 0 20px ${sponsor.color}20`
                  }}
                >
                  <Icon
                    className="transition-colors duration-500"
                    style={{ color: sponsor.color }}
                    size={32}
                  />
                </div>

                {/* Sponsor Name */}
                <div className="flex flex-col">
                  <span
                    className="font-display font-bold text-2xl text-white/80 group-hover:text-white transition-colors tracking-tight leading-none"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                  >
                    {sponsor.name}
                  </span>
                  <span className="text-[8px] font-black text-white/20 tracking-[0.2em] uppercase mt-1">Official Partner</span>
                </div>

                {/* Hover line accent */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: sponsor.color, boxShadow: `0 0 10px ${sponsor.color}` }}
                />
              </div>
            );
          })}
        </div>

        {/* High-End Sponsor Banner Call to Action */}
        <div
          ref={bannerRef}
          className="relative max-w-5xl mx-auto group"
        >
          {/* Animated Glow Backdrop */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F5B500] via-[#2E6A9C] to-[#FFD700] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse" />

          <div className="relative bg-[#0d0d0d] rounded-[2.5rem] p-10 md:p-14 overflow-hidden border border-white/10">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] carbon-fiber pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F5B500] text-xs font-black uppercase tracking-[0.3em] mb-6">
                  OPORTUNIDADE DE PARCERIA
                </div>
                <h4
                  className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase italic leading-none"
                  style={{ fontFamily: 'Teko, sans-serif' }}
                >
                  Acelere sua marca <br /> <span className="text-[#F5B500]">no topo do pódio</span>
                </h4>
                <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
                  Junte-se à temporada 2026 do RKT Raceman Kart e alcance uma audiência apaixonada no maior campeonato de kart amador do Brasil.
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  className="group/btn relative px-12 py-5 bg-[#F5B500] text-black font-display font-black uppercase text-2xl italic tracking-widest rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_40px_rgba(245,181,0,0.4)] overflow-hidden"
                  style={{ fontFamily: 'Teko, sans-serif' }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    SEJA UM PATROCINADOR <Flag size={24} />
                  </span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
                <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  CAPACIDADE LIMITADA
                </div>
              </div>
            </div>

            {/* Decorative Vector Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-full -mr-32 -mt-32" />
          </div>
        </div>
      </div>
    </section>

  );
}

export default Sponsors;
