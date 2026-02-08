import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Pilot image mapping - uses generated photos when available
const pilotImages: Record<string, string> = {
  'Lucas Silveira': '/images/pilots/pilot_pro_01.png',
  'Bruno Oliveira': '/images/pilots/pilot_pro_02.png',
  'Marco Aurélio': '/images/pilots/pilot_pro_03.png',
  'Gabriel Santos': '/images/pilots/pilot_pro_04.png',
  'Daniel Mendes': '/images/pilots/pilot_pro_05.png',
  'Gustavo Lima': '/images/pilots/pilot_pro_06.png',
  'Thiago Oliveira': '/images/pilots/pilot_light_01.png',
  'João Pedro': '/images/pilots/pilot_light_02.png',
  'Mateus Silva': '/images/pilots/pilot_light_03.png',
  'Vinícius Souza': '/images/pilots/pilot_light_04.png',
  'Leonardo Ferreira': '/images/pilots/pilot_light_05.png',
  'Rafael Gomes': '/images/pilots/pilot_light_06.png',
  // Fallback mapping for pilots not yet with photos
  'Pedro Henrique': '/images/pilots/pilot_light_01.png',
  'Paulo Souza': '/images/pilots/pilot_light_02.png',
  'Carlos Eduardo': '/images/pilots/pilot_pro_01.png',
  'Rodrigo Costa': '/images/pilots/pilot_light_03.png',
  'Renan Farah': '/images/pilots/pilot_pro_02.png',
  'Rodrigo Berger': '/images/pilots/pilot_pro_03.png',
};

// Get pilot image or return null for fallback
const getPilotImage = (name: string): string | null => {
  return pilotImages[name] || null;
};

// Get initials from name
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const podiumData = [
  { position: 2, name: 'Paulo Souza', points: 120, category: 'Light' },
  { position: 1, name: 'Pedro Henrique', points: 145, category: 'Light', highlight: true },
  { position: 3, name: 'Carlos Eduardo', points: 110, category: 'Pro' },
];

const standingsData = [
  { position: 1, category: 'Light', name: 'Pedro Henrique', points: 145, highlight: true },
  { position: 2, category: 'Light', name: 'Paulo Souza', points: 120 },
  { position: 3, category: 'Pro', name: 'Carlos Eduardo', points: 110 },
  { position: 4, category: 'Light', name: 'Rodrigo Costa', points: 98 },
  { position: 5, category: 'Pro', name: 'Renan Farah', points: 95 },
  { position: 6, category: 'Pro', name: 'Rodrigo Berger', points: 82 },
];

// Avatar component with fallback
function PilotAvatar({
  name,
  size = 'sm',
  position,
  showBorder = true
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  position?: number;
  showBorder?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = getPilotImage(name);
  const initials = getInitials(name);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 md:w-10 md:h-10 text-xs',
    md: 'w-20 h-20 md:w-24 md:h-24 text-2xl',
    lg: 'w-28 h-28 md:w-32 md:h-32 text-3xl',
  };

  // Border colors based on position
  const getBorderColor = () => {
    if (!showBorder) return 'border-gray-200 dark:border-gray-600';
    switch (position) {
      case 1: return 'border-[#F5B500] ring-4 ring-[#F5B500]/30';
      case 2: return 'border-gray-300 ring-2 ring-gray-300/30';
      case 3: return 'border-[#2E6A9C] ring-2 ring-[#2E6A9C]/30';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  // Fallback background colors
  const getFallbackBg = () => {
    switch (position) {
      case 1: return 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700';
      case 2: return 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600';
      case 3: return 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700';
      default: return 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700';
    }
  };

  const showFallback = !imageSrc || imageError;

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full overflow-hidden 
        border-4 ${getBorderColor()}
        shadow-lg
        flex-shrink-0
      `}
    >
      {showFallback ? (
        // Fallback: Show initials
        <div className={`w-full h-full flex items-center justify-center font-bold ${getFallbackBg()}`}>
          {initials}
        </div>
      ) : (
        // Show photo with object-fit cover
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={() => setImageError(true)}
          loading={size === 'lg' ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}

export function Standings() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [animatedPoints, setAnimatedPoints] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Podium animation
      const podiumItems = podiumRef.current?.querySelectorAll('.podium-item');
      if (podiumItems) {
        gsap.fromTo(
          podiumItems,
          { opacity: 0, y: 100, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: podiumRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );
      }

      // Table rows animation
      const rows = tableRef.current?.querySelectorAll('.standings-row');
      if (rows) {
        gsap.fromTo(
          rows,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                // Animate points counter
                standingsData.forEach((item, index) => {
                  gsap.to({}, {
                    duration: 1.5,
                    delay: index * 0.1,
                    onUpdate: function () {
                      const progress = this.progress();
                      setAnimatedPoints(prev => {
                        const newPoints = [...prev];
                        newPoints[index] = Math.round(item.points * progress);
                        return newPoints;
                      });
                    }
                  });
                });
              }
            }
          }
        );
      }

    }, section);

    return () => ctx.revert();
  }, []);

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'from-[#F5B500] to-[#E5AB00]';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-[#2E6A9C] to-[#1e4669]';
      default: return 'from-gray-200 to-gray-400';
    }
  };

  const getPositionHeight = (position: number) => {
    switch (position) {
      case 1: return 'h-44';
      case 2: return 'h-32';
      case 3: return 'h-24';
      default: return 'h-20';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="standings"
      className="py-20 md:py-32 bg-[#050505] relative overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#2E6A9C]/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#F5B500]/10 to-transparent" />
        {/* Carbon fiber texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none carbon-fiber" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-[#2E6A9C]/20 border border-[#2E6A9C]/30 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Trophy size={16} className="text-[#F5B500] animate-bounce" />
            <span className="text-[#F5B500] text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'Teko, sans-serif' }}>
              Campeonato 2026
            </span>
          </div>
          <h2
            ref={titleRef}
            className="text-5xl md:text-8xl font-display font-black uppercase italic text-white flex items-center justify-center leading-none tracking-tighter"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            Classificação Geral
          </h2>
          <div className="h-1.5 w-32 bg-[#F5B500] mx-auto mt-6 shadow-[0_0_15px_#F5B500]" />
        </div>

        {/* Premium Podium */}
        <div
          ref={podiumRef}
          className="flex flex-col md:flex-row justify-center items-end gap-0 md:gap-4 mb-24 max-w-5xl mx-auto"
        >
          {[2, 1, 3].map((position) => {
            const pilot = podiumData.find(p => p.position === position);
            if (!pilot) return null;

            const isWinner = position === 1;

            return (
              <div
                key={position}
                className={`podium-item flex flex-col items-center w-full md:w-1/3 ${isWinner ? 'order-1 md:order-2 z-20 scale-110 md:-translate-y-4' : position === 2 ? 'order-2 md:order-1' : 'order-3'}`}
              >
                {/* Avatar with glow for winner */}
                <div className="relative mb-6">
                  <div className={`
                    absolute inset-0 rounded-full blur-2xl opacity-50
                    ${position === 1 ? 'bg-[#F5B500]' : position === 2 ? 'bg-gray-400' : 'bg-[#2E6A9C]'}
                  `} />
                  <PilotAvatar
                    name={pilot.name}
                    size={isWinner ? 'lg' : 'md'}
                    position={position}
                    showBorder={true}
                  />

                  {/* Winner Crown Icon */}
                  {isWinner && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#F5B500]">
                      <Trophy size={40} className="drop-shadow-[0_0_10px_#F5B500]" />
                    </div>
                  )}
                </div>

                {/* Pilot Info - Premium Plate */}
                <div className={`
                  w-full text-center px-6 py-4 mb-2 rounded-t-2xl backdrop-blur-xl border-x border-t
                  ${isWinner
                    ? 'bg-gradient-to-b from-[#F5B500]/20 to-transparent border-[#F5B500]/40'
                    : 'bg-white/5 border-white/10'
                  }
                `}>
                  <div className={`font-display font-black uppercase italic text-white leading-tight ${isWinner ? 'text-2xl' : 'text-xl'}`} style={{ fontFamily: 'Teko, sans-serif' }}>
                    {pilot.name}
                  </div>
                  <div className={`text-sm font-bold tracking-tighter ${isWinner ? 'text-[#F5B500]' : 'text-gray-400'}`}>
                    {pilot.points} PONTOS
                  </div>
                </div>

                {/* Podium pedestal block */}
                <div
                  className={`
                    w-full relative overflow-hidden transition-all duration-500
                    bg-gradient-to-b ${getPositionColor(position)}
                    border-x border-b border-white/20
                    ${getPositionHeight(position)} 
                    flex flex-col items-center justify-center
                    shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                  `}
                >
                  {/* High-tech pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)`,
                    }}
                  />

                  {/* Position number - Large and integrated */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className={`
                      font-display font-black text-white leading-none tracking-tighter
                      ${isWinner ? 'text-9xl' : 'text-7xl opacity-40'}
                    `} style={{ fontFamily: 'Teko, sans-serif' }}>
                      {position}
                    </span>
                    <span className="text-white/60 font-bold uppercase tracking-widest text-[10px] -mt-2">POSITION</span>
                  </div>

                  {/* Winner shimmer effect */}
                  {isWinner && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] -translate-x-full animate-[trophy-shine_3s_linear_infinite] pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Standings Table */}
        <div
          ref={tableRef}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-2xl border border-white/10"
        >
          {/* Table Header - Racing Stripe style */}
          <div className="flex bg-gradient-to-r from-[#2E6A9C] via-[#0D0D0D] to-[#F5B500] text-white font-display text-xl md:text-2xl uppercase italic py-5 px-6 tracking-wider" style={{ fontFamily: 'Teko, sans-serif' }}>
            <div className="w-20 text-center">POS</div>
            <div className="w-24 text-center hidden sm:block border-l border-white/20">CAT</div>
            <div className="flex-1 pl-8 border-l border-white/20">PILOTO</div>
            <div className="w-32 text-right pr-6 border-l border-white/20">TOTAL PONTOS</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {standingsData.map((item, index) => (
              <div
                key={item.name}
                className={`
                  standings-row relative group flex items-center py-5 px-6 
                  transition-all duration-500
                  hover:bg-white/[0.07]
                  ${item.highlight ? 'bg-[#F5B500]/5' : ''}
                `}
              >
                {/* Position Marker */}
                <div className={`
                  w-20 text-center font-display font-black text-3xl italic tracking-tighter leading-none
                  ${item.position === 1 ? 'text-[#F5B500] drop-shadow-[0_0_8px_#F5B500]' :
                    item.position === 2 ? 'text-gray-400' :
                      item.position === 3 ? 'text-[#2E6A9C]' :
                        'text-white/40'
                  }
                `} style={{ fontFamily: 'Teko, sans-serif' }}>
                  #{item.position.toString().padStart(2, '0')}
                </div>

                {/* Category Badge */}
                <div className="w-24 text-center hidden sm:block">
                  <span className={`
                    text-[10px] font-black px-2.5 py-1 rounded skew-x-[-15deg] uppercase tracking-widest
                    ${item.category === 'Pro' ? 'bg-[#F5B500] text-black' : 'bg-gray-700 text-gray-300'}
                  `}>
                    <span className="inline-block skew-x-[15deg]">{item.category}</span>
                  </span>
                </div>

                {/* Pilot Identity */}
                <div className="flex-1 pl-8 flex items-center">
                  <div className="relative group-hover:scale-110 transition-transform duration-300">
                    <PilotAvatar
                      name={item.name}
                      size="sm"
                      position={item.position}
                      showBorder={index < 3}
                    />
                    {item.highlight && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F5B500] rounded-full animate-ping" />}
                  </div>
                  <div className="ml-4">
                    <span className={`
                      block font-display text-xl uppercase italic tracking-wide transition-colors
                      ${item.highlight ? 'text-white font-black' : 'text-white/80 group-hover:text-white'}
                    `} style={{ fontFamily: 'Teko, sans-serif' }}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-none">Scuderia RKT</span>
                  </div>
                </div>

                {/* Points Counter */}
                <div className={`
                  w-32 text-right pr-6 font-display text-3xl italic font-black tracking-tighter transition-all duration-300
                  ${item.highlight ? 'text-[#F5B500] scale-110' : 'text-white/60 group-hover:text-white'}
                `} style={{ fontFamily: 'Teko, sans-serif' }}>
                  {animatedPoints[index]} <span className="text-xs ml-1 opacity-50 not-italic uppercase">Pts</span>
                </div>

                {/* Row Hover Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F5B500] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 shadow-[0_0_10px_#F5B500]" />
              </div>
            ))}
          </div>

          {/* Table Footer - High Tech Link */}
          <div className="py-6 text-center bg-black/40 backdrop-blur-md border-t border-white/10 group/footer overflow-hidden relative">
            <button className="relative z-10 text-white font-display font-black uppercase text-xl leading-none italic tracking-widest flex items-center justify-center gap-3 mx-auto transition-all duration-500 hover:gap-6" style={{ fontFamily: 'Teko, sans-serif' }}>
              Ver Relatório de Temporada Completo
              <TrendingUp size={24} className="text-[#F5B500]" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F5B500]/5 to-transparent -translate-x-full group-hover/footer:translate-x-full transition-transform duration-1000" />
          </div>
        </div>
      </div>

      {/* Decorative side lines */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#F5B500]/20 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#2E6A9C]/20 to-transparent" />
    </section>

  );
}

export default Standings;
