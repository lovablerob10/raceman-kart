import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fuel, Wrench, Shield, Gauge, Flag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const sponsors = [
  { name: 'RACING CO', icon: Flag, color: '#303285' },
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
      className="py-12 md:py-16 bg-white dark:bg-[#262626] border-t border-gray-200 dark:border-gray-800 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Title */}
        <h3 
          ref={titleRef}
          className="text-2xl md:text-3xl font-display uppercase font-bold text-gray-400 mb-10 text-center"
          style={{ fontFamily: 'Teko, sans-serif' }}
        >
          Patrocinadores Oficiais
        </h3>

        {/* Sponsors Grid */}
        <div 
          ref={sponsorsRef}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
        >
          {sponsors.map((sponsor) => {
            const Icon = sponsor.icon;
            return (
              <div 
                key={sponsor.name}
                className="sponsor-item group flex items-center space-x-3 cursor-pointer transition-all duration-300 hover:scale-110"
              >
                <div 
                  className="p-3 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                  style={{ 
                    backgroundColor: `${sponsor.color}20`,
                  }}
                >
                  <Icon 
                    className="text-3xl md:text-4xl transition-colors duration-300"
                    style={{ color: sponsor.color }}
                    size={32}
                  />
                </div>
                <span 
                  className="font-bold text-lg md:text-xl text-gray-700 dark:text-gray-300 group-hover:text-[#ff4422] transition-colors"
                >
                  {sponsor.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Sponsor Banner */}
        <div 
          ref={bannerRef}
          className="mt-12 relative overflow-hidden rounded-xl"
        >
          <div className="bg-gradient-to-r from-[#303285] via-[#ff4422] to-[#303285] p-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 
                  className="text-2xl md:text-3xl font-display font-bold text-[#303285] dark:text-white mb-2"
                  style={{ fontFamily: 'Teko, sans-serif' }}
                >
                  Seja um Patrocinador
                </h4>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Junte-se aos maiores nomes do automobilismo e alcance milhares de fãs apaixonados por velocidade.
                </p>
              </div>
              <button 
                className="bg-[#ff4422] hover:bg-[#ff6644] text-white font-display uppercase text-lg px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#ff4422]/30 hover:-translate-y-1"
                style={{ fontFamily: 'Teko, sans-serif' }}
              >
                Quero Patrocinar
              </button>
            </div>
          </div>
          
          {/* Animated border */}
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #ff4422, #ffd700, #ff4422)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
              opacity: 0.5,
              zIndex: -1,
              filter: 'blur(8px)'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}

export default Sponsors;
