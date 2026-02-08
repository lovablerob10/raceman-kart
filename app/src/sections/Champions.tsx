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
      className="py-16 md:py-24 bg-gray-50 dark:bg-[#1a1a1a] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#F5B500]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#2E6A9C]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Crown className="text-[#F5B500] w-10 h-10 md:w-12 md:h-12" />
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase italic text-center text-[#2E6A9C] dark:text-white"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            Galeria de Campeões
          </h2>
          <Crown className="text-[#F5B500] w-10 h-10 md:w-12 md:h-12" />
        </div>

        {/* Champions Gallery */}
        <div
          ref={galleryRef}
          className="flex overflow-x-auto space-x-4 md:space-x-6 pb-6 px-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {champions.map((champion) => (
            <GlitchCard
              key={champion.year}
              className="champion-card snap-center shrink-0 w-48 md:w-56"
              intensity="medium"
              glitchColor1="#F5B500"
              glitchColor2="#2E6A9C"
            >
              <div className="relative group cursor-pointer">
                {/* Card */}
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl relative">
                  {/* Trophy shine overlay */}
                  <div
                    className="trophy-shine absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.2) 50%, transparent 100%)',
                      backgroundSize: '200% 100%'
                    }}
                  />

                  {/* Champion Photo */}
                  <ChampionAvatar name={champion.name} />

                  {/* Gold border glow on hover */}
                  <div className="absolute inset-0 border-4 border-[#F5B500]/0 group-hover:border-[#F5B500]/60 rounded-xl transition-all duration-300 z-10 pointer-events-none" />

                  {/* Year badge */}
                  <div
                    className="absolute bottom-4 left-0 bg-[#2E6A9C] text-white font-display px-4 py-1 text-2xl shadow-lg z-20"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                  >
                    {champion.year}
                  </div>

                  {/* Name overlay - always visible at bottom */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-3 z-20">
                    <p
                      className="text-white text-center font-bold uppercase tracking-wider text-sm px-2"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    >
                      {champion.name}
                    </p>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#F5B500] opacity-0 group-hover:opacity-100 transition-opacity z-20" />
                  <div className="absolute bottom-14 left-2 w-8 h-8 border-b-2 border-l-2 border-[#F5B500] opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                  {/* Trophy icon overlay */}
                  <div className="absolute top-3 left-3 z-20">
                    <Trophy className="w-6 h-6 text-[#F5B500] drop-shadow-lg" />
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-[#F5B500] via-[#2E6A9C] to-[#F5B500] mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </GlitchCard>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {champions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-[#ff4422] w-6' : 'bg-gray-300 dark:bg-gray-600'
                }`}
            />
          ))}
        </div>

        {/* Hall of Fame stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white dark:bg-[#262626] rounded-xl shadow-lg">
            <Trophy className="w-8 h-8 text-[#F5B500] mx-auto mb-2" />
            <div
              className="text-3xl font-display font-bold text-[#2E6A9C] dark:text-white"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              21
            </div>
            <div className="text-gray-500 text-sm">Edições</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-[#262626] rounded-xl shadow-lg">
            <Crown className="w-8 h-8 text-[#2E6A9C] mx-auto mb-2" />
            <div
              className="text-3xl font-display font-bold text-[#2E6A9C] dark:text-white"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              15
            </div>
            <div className="text-gray-500 text-sm">Campeões</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-[#262626] rounded-xl shadow-lg">
            <Star className="w-8 h-8 text-[#2E6A9C] mx-auto mb-2" />
            <div
              className="text-3xl font-display font-bold text-[#2E6A9C] dark:text-white"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              200+
            </div>
            <div className="text-gray-500 text-sm">Pilotos</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-[#262626] rounded-xl shadow-lg">
            <div className="w-8 h-8 rounded-full bg-[#22c55e] mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs font-bold">KM</span>
            </div>
            <div
              className="text-3xl font-display font-bold text-[#2E6A9C] dark:text-white"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              50K
            </div>
            <div className="text-gray-500 text-sm">Km Corridos</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Champions;
