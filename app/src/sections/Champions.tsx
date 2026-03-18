import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlitchCard } from '../components/GlitchCard';
import { supabase } from '../lib/supabase';
import fallbackChampions from '../data/fallbackChampions.json';

gsap.registerPlugin(ScrollTrigger);

interface Champion {
  id: string;
  year: number;
  pilot_name: string;
  category: string;
  image_url: string;
}

const CACHE_KEY_CHAMPIONS = 'raceman_champions_cache';

function getCachedChampions(): Champion[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY_CHAMPIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return fallbackChampions as Champion[];
}

export function Champions() {
  // Cache-first: load from localStorage instantly
  const cached = getCachedChampions();
  const [champions, setChampions] = useState<Champion[]>(cached);
  const [loading, setLoading] = useState(cached.length === 0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async (attempt = 1): Promise<void> => {
    setFetchError(null);
    try {
      console.log(`[Champions] Fetching... (attempt ${attempt})`);
      const { data, error } = await supabase
        .from('champions')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        console.error('[Champions] Supabase error:', error);
        throw error;
      }
      console.log('[Champions] Success:', data?.length);
      const sorted = (data || []).sort((a: any, b: any) => {
        if (b.year !== a.year) return b.year - a.year;
        return (a.category || '').localeCompare(b.category || '');
      });
      setChampions(sorted);
      // Update cache for next visit
      try { localStorage.setItem(CACHE_KEY_CHAMPIONS, JSON.stringify(sorted)); } catch { /* quota */ }
      setLoading(false);
    } catch (err: any) {
      console.error(`[Champions] Error (attempt ${attempt}):`, err?.message || err);
      if (attempt < 3) {
        console.log(`[Champions] Retrying in 2s...`);
        await new Promise(r => setTimeout(r, 4000));
        return fetchChampions(attempt + 1);
      }
      setFetchError(err?.message || 'Unknown error');
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
      if (cards && cards.length > 0) {
        // Fallback: ensure cards are visible even if GSAP fails
        cards.forEach(card => {
          (card as HTMLElement).style.opacity = '1';
          (card as HTMLElement).style.transform = 'none';
        });
        try {
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
        } catch (e) {
          console.warn('[Champions] GSAP animation failed, cards visible via fallback');
        }
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
      <section id="champions" className="py-20 md:py-32 bg-[#050505] flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#F5B500]/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-[#F5B500] rounded-full animate-spin" />
            <Crown size={24} className="absolute inset-0 m-auto text-[#F5B500] animate-pulse" />
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-black uppercase italic text-white/60" style={{ fontFamily: 'Teko, sans-serif' }}>
            Carregando Campeões...
          </h3>
        </div>
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
            {champions.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <Trophy className="w-20 h-20 text-[#F5B500]/20 mb-6" />
                <h3
                  className="text-4xl md:text-5xl font-display font-black uppercase italic text-white/30 mb-4"
                  style={{ fontFamily: 'Teko, sans-serif' }}
                >
                  Nenhum campeão encontrado
                </h3>
                {fetchError && (
                  <p className="text-red-400/80 text-sm mb-4 max-w-md text-center">Erro: {fetchError}</p>
                )}
                <p className="text-white/15 text-lg uppercase tracking-widest font-bold mb-6" style={{ fontFamily: 'Teko, sans-serif' }}>
                  Verifique sua conexão
                </p>
                <button
                  onClick={() => { setLoading(true); fetchChampions(); }}
                  className="px-6 py-2 bg-[#F5B500] text-black font-bold uppercase rounded hover:bg-[#F5B500]/80 transition-all"
                  style={{ fontFamily: 'Teko, sans-serif' }}
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
            champions.map((champion) => (
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
            ))
            )}
          </div>
        </div>


      </div>
    </section>
  );
}

export default Champions;
