import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flag, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: 'premium' | 'standard';
}

export function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sponsorsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('id, name, logo_url, website_url, tier')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching sponsors:', error);
      } else {
        setSponsors(data || []);
      }
      setIsLoading(false);
    };

    fetchSponsors();
  }, []);

  useEffect(() => {
    if (isLoading) return;

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
      if (items && items.length > 0) {
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
    }, section);

    return () => ctx.revert();
  }, [isLoading, sponsors]);

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

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#F5B500] animate-spin" />
          </div>
        )}

        {/* Premium Sponsors Grid */}
        {!isLoading && sponsors.length > 0 && (
          <div
            ref={sponsorsRef}
            className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mb-20"
          >
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                onClick={() => sponsor.website_url && window.open(sponsor.website_url, '_blank')}
                role={sponsor.website_url ? 'button' : undefined}
                className={`sponsor-item group relative flex items-center justify-center px-8 py-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${sponsor.website_url ? 'cursor-pointer' : ''
                  } ${sponsor.tier === 'premium' ? 'min-w-[200px] min-h-[120px]' : 'min-w-[160px] min-h-[90px]'
                  }`}
              >
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className={`object-contain transition-all duration-500 group-hover:scale-110 ${sponsor.tier === 'premium'
                        ? 'max-h-20 max-w-[180px]'
                        : 'max-h-14 max-w-[140px]'
                      }`}
                  />
                ) : (
                  <span
                    className={`font-display font-bold text-white/80 group-hover:text-white transition-colors tracking-tight leading-none ${sponsor.tier === 'premium' ? 'text-3xl' : 'text-2xl'
                      }`}
                    style={{ fontFamily: 'Teko, sans-serif' }}
                  >
                    {sponsor.name}
                  </span>
                )}

                {/* Premium glow */}
                {sponsor.tier === 'premium' && (
                  <div className="absolute -inset-px rounded-2xl border border-[#F5B500]/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                )}

                {/* Hover line accent */}
                <div
                  className={`absolute bottom-0 left-4 right-4 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${sponsor.tier === 'premium' ? 'bg-[#F5B500] shadow-[0_0_10px_#F5B500]' : 'bg-[#2E6A9C] shadow-[0_0_10px_#2E6A9C]'
                    }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Show nothing if no sponsors and not loading */}
        {!isLoading && sponsors.length === 0 && (
          <div className="mb-20" />
        )}

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
