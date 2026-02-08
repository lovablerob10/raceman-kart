import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Crown, Star } from 'lucide-react';
import { GlitchCard } from '../components/GlitchCard';

gsap.registerPlugin(ScrollTrigger);

// Champion image mapping
const championImages: Record<string, string> = {
  'MARCO AURÉLIO': '/images/pilots/pilot_pro_03.png',
  'FELIPE ANDRADE': '/images/pilots/pilot_pro_04.png',
  'RICARDO RAMOS': '/images/pilots/pilot_pro_05.png',
  'PAULO SOUZA': '/images/pilots/pilot_light_02.png',
  'PEDRO HENRIQUE': '/images/pilots/pilot_light_01.png',
  'CARLOS EDUARDO': '/images/pilots/pilot_pro_01.png',
};

const champions = [
  { year: '2025', name: 'MARCO AURÉLIO' },
  { year: '2024', name: 'MARCO AURÉLIO' },
  { year: '2023', name: 'FELIPE ANDRADE' },
  { year: '2022', name: 'FELIPE ANDRADE' },
  { year: '2021', name: 'RICARDO RAMOS' },
  { year: '2020', name: 'PAULO SOUZA' },
  { year: '2019', name: 'PEDRO HENRIQUE' },
  { year: '2018', name: 'CARLOS EDUARDO' },
];

// Get initials from name
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function Champions() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  // Champion Avatar component with fallback
  function ChampionAvatar({ name }: { name: string }) {
    const [imageError, setImageError] = useState(false);
    const imageSrc = championImages[name];
    const initials = getInitials(name);

    if (!imageSrc || imageError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
          <Trophy className="w-16 h-16 text-[#F5B500] mb-2" />
          <span className="text-white font-bold text-xl">{initials}</span>
        </div>
      );
    }

    return (
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      id="champions"
      className="py-20 md:py-32 bg-[#050505] relative overflow-hidden"
    >
      {/* Background decorations - Premium Gold/Racing style */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#F5B500]/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#2E6A9C]/10 to-transparent" />

        {/* Animated particles or blurred gold spots */}
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

        {/* Champions Gallery - Horizontal Snap Scroll */}
        <div
          ref={galleryRef}
          className="flex overflow-x-auto space-x-6 pb-12 px-4 snap-x snap-mandatory scrollbar-hide no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {champions.map((champion) => (
            <GlitchCard
              key={champion.year}
              className="champion-card snap-center shrink-0 w-64 md:w-72"
              intensity="medium"
              glitchColor1="#F5B500"
              glitchColor2="#2E6A9C"
            >
              <div className="relative group cursor-pointer transition-all duration-500">
                {/* Premium Gold Card */}
                <div className="aspect-[3/4.5] overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl relative border border-white/5 group-hover:border-[#F5B500]/30">
                  {/* Trophy shine overlay */}
                  <div
                    className="trophy-shine absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(110deg, transparent 0%, rgba(245,181,0,0.1) 45%, rgba(245,181,0,0.2) 50%, rgba(245,181,0,0.1) 55%, transparent 100%)',
                      backgroundSize: '200% 100%'
                    }}
                  />

                  {/* Champion Photo */}
                  <ChampionAvatar name={champion.name} />

                  {/* Dark mask at bottom for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />

                  {/* Year Tag - Floating Sleek Display */}
                  <div className="absolute top-4 left-4 z-30">
                    <div className="bg-[#F5B500] text-black font-display font-black px-4 py-1.5 text-3xl shadow-[0_10px_20px_rgba(245,181,0,0.4)] transform -skew-x-12" style={{ fontFamily: 'Teko, sans-serif' }}>
                      {champion.year}
                    </div>
                  </div>

                  {/* Top Trophy Icon */}
                  <div className="absolute top-4 right-4 z-30 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Trophy className="w-8 h-8 text-[#F5B500] drop-shadow-[0_0_10px_rgba(245,181,0,0.5)]" />
                  </div>

                  {/* Pilot Identity - Premium Plate style */}
                  <div className="absolute bottom-0 left-0 w-full p-6 z-30">
                    <div className="text-[#F5B500] font-black tracking-widest text-[10px] uppercase mb-1 drop-shadow-lg">CAMPEÃO TEMPORADA</div>
                    <p
                      className="text-white font-display text-4xl font-black uppercase italic leading-none tracking-tighter group-hover:text-[#F5B500] transition-colors"
                      style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                      {champion.name}
                    </p>
                  </div>

                  {/* Hover Accent Glow */}
                  <div className="absolute inset-0 border-2 border-[#F5B500] opacity-0 group-hover:opacity-40 rounded-2xl transition-all duration-500 z-40 pointer-events-none blur-sm" />
                </div>

                {/* Status indicator bar */}
                <div className="h-1.5 w-1/2 mx-auto bg-[#F5B500] mt-4 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 shadow-[0_0_15px_#F5B500]" />
              </div>
            </GlitchCard>
          ))}
        </div>

        {/* Custom Scroll Progress Bar */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <div className="h-px w-24 bg-white/10" />
          <div className="flex gap-2.5">
            {champions.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === 0 ? 'bg-[#F5B500] w-12 shadow-[0_0_10px_#F5B500]' : 'bg-white/10 w-4'
                  }`}
              />
            ))}
          </div>
          <div className="h-px w-24 bg-white/10" />
        </div>

        {/* High-Tech Hall of Fame Stats Section */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <Trophy className="absolute -right-4 -top-4 w-24 h-24 text-[#F5B500] opacity-10 group-hover:opacity-20 transition-opacity rotate-12" />
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>21</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Edições</div>
              </div>
            </div>

            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <Crown className="absolute -right-4 -top-4 w-24 h-24 text-[#2E6A9C] opacity-10 group-hover:opacity-20 transition-opacity -rotate-12" />
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>15</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Lendas</div>
              </div>
            </div>

            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <Star className="absolute -right-4 -top-4 w-24 h-24 text-[#F5B500] opacity-10 group-hover:opacity-20 transition-opacity rotate-45" />
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>200<span className="text-[#F5B500]">+</span></div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Guerreiros</div>
              </div>
            </div>

            <div className="relative group p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <div className="absolute -right-4 -top-4 w-24 h-24 text-[#22c55e] opacity-10 group-hover:opacity-20 transition-opacity flex items-center justify-center font-black text-4xl">KM</div>
              <div className="relative z-10">
                <div className="text-4xl md:text-6xl font-display font-black text-white leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>50<span className="text-[#22c55e]">K</span></div>
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
