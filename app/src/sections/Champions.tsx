import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Crown, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlitchCard } from '../components/GlitchCard';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface Champion {
  id: string;
  year: number;
  pilot_name: string;
  category: string;
  image_url: string;
}

export function Champions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    try {
      const { data, error } = await supabase
        .from('champions')
        .select('*')
        .order('year', { ascending: false })
        .order('category', { ascending: true });

      if (error) throw error;
      setChampions(data || []);
    } catch (err) {
      console.error('Error fetching champions:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!galleryRef.current) return;
    const scrollAmount = galleryRef.current.clientWidth * 0.8;
    galleryRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (loading) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.8, rotation: -5 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Gallery cards animation
      const cards = galleryRef.current?.querySelectorAll('.champion-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, x: 100, rotation: 10 },
          {
            opacity: 1,
            x: 0,
            rotation: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );
      }

      // Trophy shine animation
      gsap.to('.trophy-shine', {
        backgroundPosition: '200% center',
        duration: 3,
        repeat: -1,
        ease: 'none'
      });

    }, section);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <section className="py-20 bg-[#050505] flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#F5B500] animate-spin" />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="champions"
      className="py-20 md:py-32 bg-[#050505] relative overflow-hidden group/section"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#F5B500]/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#2E6A9C]/10 to-transparent" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#F5B500]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#2E6A9C]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-[#F5B500]" />
            <Crown className="text-[#F5B500] w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_#F5B500]" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-[#F5B500]" />
          </div>
          <h2
            ref={titleRef}
            className="text-5xl md:text-8xl font-display font-black uppercase italic text-white leading-none tracking-tighter"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            Galeria de Campeões
          </h2>
          <p className="text-[#F5B500] mt-4 text-xl font-bold tracking-[0.3em] uppercase italic" style={{ fontFamily: 'Teko, sans-serif' }}>
            A Elite RKT Raceman
          </p>
        </div>

        {/* Champions Gallery Container with Netflix Arrows */}
        <div className="relative group/gallery">
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollGallery('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 h-[80%] px-4 bg-black/40 text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-black/60 backdrop-blur-sm hidden md:flex items-center"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-10 h-10 text-[#F5B500]" />
          </button>

          <button
            onClick={() => scrollGallery('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 h-[80%] px-4 bg-black/40 text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-black/60 backdrop-blur-sm hidden md:flex items-center"
            aria-label="Próximo"
          >
            <ChevronRight className="w-10 h-10 text-[#F5B500]" />
          </button>

          {/* Champions Gallery */}
          <div
            ref={galleryRef}
            className="flex overflow-x-auto space-x-6 pb-12 px-4 snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {champions.map((champion) => (
              <GlitchCard
                key={champion.id}
                className="champion-card snap-center shrink-0 w-64 md:w-72"
                intensity="low"
                glitchColor1="#F5B500"
                glitchColor2="#2E6A9C"
              >
                <div className="relative group cursor-pointer transition-all duration-500">
                  <div className="aspect-[3/4.5] overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl relative border border-white/5 group-hover:border-[#F5B500]/30">
                    <div
                      className="trophy-shine absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: 'linear-gradient(110deg, transparent 0%, rgba(245,181,0,0.1) 45%, rgba(245,181,0,0.2) 50%, rgba(245,181,0,0.1) 55%, transparent 100%)',
                        backgroundSize: '200% 100%'
                      }}
                    />

                    {/* Photo */}
                    <img
                      src={champion.image_url || 'https://images.unsplash.com/photo-1533560272421-facb2cffddfe?auto=format&fit=crop&q=80&w=800'}
                      alt={champion.pilot_name}
                      className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />

                    {/* Year Tag */}
                    <div className="absolute top-4 left-4 z-30">
                      <div className="bg-[#F5B500] text-black font-display font-black px-4 py-1.5 text-3xl shadow-[0_10px_20px_rgba(245,181,0,0.4)] transform -skew-x-12" style={{ fontFamily: 'Teko, sans-serif' }}>
                        {champion.year}
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-4 right-4 z-30">
                      <div className="bg-white/10 backdrop-blur-md text-white font-bold px-3 py-1 text-xs rounded-full border border-white/10 uppercase tracking-widest">
                        {champion.category}
                      </div>
                    </div>

                    {/* Pilot Identity */}
                    <div className="absolute bottom-0 left-0 w-full p-6 z-30">
                      <div className="text-[#F5B500] font-black tracking-widest text-[10px] uppercase mb-1 drop-shadow-lg">CAMPEÃO TEMPORADA</div>
                      <p
                        className="text-white font-display text-4xl font-black uppercase italic leading-none tracking-tighter group-hover:text-[#F5B500] transition-colors"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                      >
                        {champion.pilot_name}
                      </p>
                    </div>

                    <div className="absolute inset-0 border-2 border-[#F5B500] opacity-0 group-hover:opacity-40 rounded-2xl transition-all duration-500 z-40 pointer-events-none blur-sm" />
                  </div>
                  <div className="h-1.5 w-1/2 mx-auto bg-[#F5B500] mt-4 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 shadow-[0_0_15px_#F5B500]" />
                </div>
              </GlitchCard>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <Trophy className="absolute -right-4 -top-4 w-24 h-24 text-[#F5B500] opacity-10 group-hover:opacity-20 transition-opacity rotate-12" />
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>{new Set(champions.map(c => c.year)).size}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Edições</div>
              </div>
            </div>

            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <Crown className="absolute -right-4 -top-4 w-24 h-24 text-[#2E6A9C] opacity-10 group-hover:opacity-20 transition-opacity -rotate-12" />
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>{new Set(champions.map(c => c.pilot_name)).size}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Lendas</div>
              </div>
            </div>

            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <Star className="absolute -right-4 -top-4 w-24 h-24 text-[#F5B500] opacity-10 group-hover:opacity-20 transition-opacity rotate-45" />
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>200+</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Pilotos</div>
              </div>
            </div>

            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <div className="absolute -right-4 -top-4 w-24 h-24 text-[#22c55e] opacity-10 group-hover:opacity-20 transition-opacity flex items-center justify-center font-black text-4xl">KM</div>
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>50K</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Percorridos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Champions;
