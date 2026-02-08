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
      className="py-16 md:py-24 bg-gray-50 dark:bg-[#1a1a1a] relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-gray-200 dark:from-black/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase italic text-center mb-16 text-[#2E6A9C] dark:text-white"
          style={{ fontFamily: 'Teko, sans-serif' }}
        >
          Classificação Geral
        </h2>

        {/* Podium */}
        <div
          ref={podiumRef}
          className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-16 max-w-4xl mx-auto"
        >
          {[2, 1, 3].map((position) => {
            const pilot = podiumData.find(p => p.position === position);
            if (!pilot) return null;

            return (
              <div
                key={position}
                className={`podium-item flex flex-col items-center ${position === 1 ? 'order-1 md:order-2 z-10' : position === 2 ? 'order-2 md:order-1' : 'order-3'}`}
              >
                {/* Avatar with photo */}
                <div className="relative mb-2">
                  <PilotAvatar
                    name={pilot.name}
                    size={position === 1 ? 'lg' : 'md'}
                    position={position}
                    showBorder={true}
                  />

                  {/* Position badge */}
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full shadow-lg ${position === 1 ? 'bg-[#F5B500] text-[#2D2D2D]' :
                      position === 2 ? 'bg-gray-300 text-[#2D2D2D]' :
                        'bg-[#2E6A9C] text-white'
                      }`}
                  >
                    {position}º
                  </div>
                </div>

                {/* Info */}
                <div className="text-center mb-2 mt-2">
                  <div className={`font-bold text-gray-800 dark:text-gray-200 leading-tight ${position === 1 ? 'text-lg' : ''}`}>
                    {pilot.name}
                  </div>
                  <div className="text-sm text-gray-500">{pilot.points} pts</div>
                </div>

                {/* Podium block */}
                <div
                  className={`w-28 md:w-32 bg-gradient-to-b ${getPositionColor(position)} rounded-t-lg shadow-lg flex items-center justify-center relative overflow-hidden ${getPositionHeight(position)}`}
                >
                  {/* Checkered pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #000 25%, transparent 25%),
                        linear-gradient(-45deg, #000 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #000 75%),
                        linear-gradient(-45deg, transparent 75%, #000 75%)
                      `,
                      backgroundSize: '10px 10px'
                    }}
                  />
                  <span className={`text-4xl md:text-6xl font-display font-bold text-white relative z-10 ${position !== 1 ? 'opacity-50' : ''}`}>
                    {position}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Standings Table */}
        <div
          ref={tableRef}
          className="max-w-4xl mx-auto bg-white dark:bg-[#262626] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex bg-[#2E6A9C] text-white font-display text-lg md:text-xl uppercase py-4 px-4 md:px-6">
            <div className="w-12 md:w-16 text-center">Pos</div>
            <div className="w-16 md:w-20 text-center hidden sm:block">Cat</div>
            <div className="flex-1 pl-4">Piloto</div>
            <div className="w-20 md:w-24 text-right pr-2 md:pr-4">Pontos</div>
          </div>

          {/* Rows */}
          {standingsData.map((item, index) => (
            <div
              key={item.name}
              className={`standings-row flex items-center py-3 md:py-4 px-4 md:px-6 border-b border-gray-100 dark:border-gray-700 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 ${item.highlight ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                }`}
            >
              <div className={`w-12 md:w-16 text-center font-bold text-xl ${item.position === 1 ? 'text-[#F5B500]' :
                item.position === 2 ? 'text-gray-400' :
                  item.position === 3 ? 'text-[#2E6A9C]' :
                    'text-gray-500'
                }`}>
                {item.position}º
              </div>

              <div className="w-16 md:w-20 text-center hidden sm:block">
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.category === 'Pro' ? 'bg-[#2E6A9C] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                  {item.category}
                </span>
              </div>

              <div className="flex-1 pl-4 flex items-center">
                {/* Avatar with photo */}
                <PilotAvatar
                  name={item.name}
                  size="sm"
                  position={item.position}
                  showBorder={true}
                />
                <span className={`font-medium text-gray-700 dark:text-gray-300 text-sm md:text-base ml-3 ${item.highlight ? 'font-bold' : ''}`}>
                  {item.name}
                </span>
                {item.highlight && <Trophy className="ml-2 text-yellow-500" size={16} />}
              </div>

              <div className={`w-20 md:w-24 text-right pr-2 md:pr-4 font-display text-xl md:text-2xl ${item.highlight ? 'text-[#F5B500]' : 'text-[#2E6A9C] dark:text-blue-300'
                }`}>
                {animatedPoints[index]} PTS
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="py-4 text-center bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700">
            <button className="text-[#2E6A9C] font-bold uppercase text-sm hover:underline flex items-center justify-center gap-2 mx-auto transition-all hover:gap-4">
              Ver Tabela Completa
              <TrendingUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#ff4422]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-[#303285]/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}

export default Standings;
