import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlitchCard } from '../components/GlitchCard';

gsap.registerPlugin(ScrollTrigger);

const proDrivers = [
  { number: '27', name: 'Lucas Silveira', color: '#ff4422', image: '/images/pilots/pilot_pro_01.png' },
  { number: '45', name: 'Bruno Oliveira', color: '#3b82f6', image: '/images/pilots/pilot_pro_02.png' },
  { number: '07', name: 'Marco Aurélio', color: '#3b82f6', image: '/images/pilots/pilot_pro_03.png' },
  { number: '88', name: 'Gabriel Santos', color: '#ff4422', image: '/images/pilots/pilot_pro_04.png' },
  { number: '03', name: 'Daniel Mendes', color: '#3b82f6', image: '/images/pilots/pilot_pro_05.png' },
  { number: '82', name: 'Gustavo Lima', color: '#3b82f6', image: '/images/pilots/pilot_pro_06.png' },
];

const lightDrivers = [
  { number: '12', name: 'Thiago Oliveira', color: '#22c55e', image: '/images/pilots/pilot_light_01.png' },
  { number: '33', name: 'João Pedro', color: '#a855f7', image: '/images/pilots/pilot_light_02.png' },
  { number: '55', name: 'Mateus Silva', color: '#f59e0b', image: '/images/pilots/pilot_light_03.png' },
  { number: '77', name: 'Vinícius Souza', color: '#ef4444', image: '/images/pilots/pilot_light_04.png' },
  { number: '99', name: 'Leonardo Ferreira', color: '#06b6d4', image: '/images/pilots/pilot_light_05.png' },
  { number: '21', name: 'Rafael Gomes', color: '#84cc16', image: '/images/pilots/pilot_light_06.png' },
];

export function Drivers() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'pro' | 'light'>('pro');

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

      // Tabs animation
      gsap.fromTo(
        tabsRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Grid animation
      animateGrid();

    }, section);

    return () => ctx.revert();
  }, []);

  const animateGrid = () => {
    const cards = gridRef.current?.querySelectorAll('.driver-card');
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.4)',
        }
      );
    }
  };

  const handleTabChange = (tab: 'pro' | 'light') => {
    if (tab === activeTab) return;

    // Animate out current cards
    const cards = gridRef.current?.querySelectorAll('.driver-card');
    if (cards) {
      gsap.to(cards, {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          setActiveTab(tab);
          // Animate in new cards
          setTimeout(animateGrid, 50);
        }
      });
    }
  };

  const currentDrivers = activeTab === 'pro' ? proDrivers : lightDrivers;

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="py-16 md:py-24 bg-[#303285] relative overflow-hidden"
    >
      {/* Carbon fiber pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.1) 2px,
            rgba(0,0,0,0.1) 4px
          )`
        }}
      />

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 border border-white/10 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-60 h-60 border border-white/5 rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase italic text-center mb-10 text-white"
          style={{ fontFamily: 'Teko, sans-serif' }}
        >
          Pilotos da Temporada
        </h2>

        {/* Category Tabs */}
        <div
          ref={tabsRef}
          className="flex justify-center space-x-4 mb-12"
        >
          <button
            onClick={() => handleTabChange('pro')}
            className={`px-8 py-3 font-display uppercase text-xl rounded-lg transition-all duration-300 ${activeTab === 'pro'
              ? 'bg-[#ff4422] text-white shadow-lg shadow-[#ff4422]/30 scale-110'
              : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
              }`}
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            Pro
          </button>
          <button
            onClick={() => handleTabChange('light')}
            className={`px-8 py-3 font-display uppercase text-xl rounded-lg transition-all duration-300 ${activeTab === 'light'
              ? 'bg-[#ff4422] text-white shadow-lg shadow-[#ff4422]/30 scale-110'
              : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
              }`}
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            Light
          </button>
        </div>

        {/* Drivers Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {currentDrivers.map((driver) => (
            <GlitchCard
              key={driver.number}
              className="driver-card"
              intensity="low"
              glitchColor1={driver.color}
              glitchColor2="#ffffff"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                {/* Driver Image */}
                <div className="relative overflow-hidden aspect-[3/4]">
                  {/* Real Photo */}
                  <img
                    src={driver.image}
                    alt={driver.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient overlay for better text readability */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                  />

                  {/* Number overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <div
                      className="text-white font-display text-4xl font-bold leading-none drop-shadow-lg"
                      style={{
                        fontFamily: 'Teko, sans-serif',
                        textShadow: `0 0 20px ${driver.color}, 0 0 40px ${driver.color}50`
                      }}
                    >
                      {driver.number}
                    </div>
                  </div>

                  {/* Hover overlay with color accent */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${driver.color} 0%, transparent 100%)` }}
                  />
                </div>

                {/* Name bar */}
                <div
                  className="p-2 transition-all duration-300 group-hover:brightness-110"
                  style={{ background: driver.color }}
                >
                  <div
                    className="text-white font-bold uppercase text-xs leading-tight text-center truncate"
                  >
                    {driver.name}
                  </div>
                </div>
              </div>
            </GlitchCard>
          ))}
        </div>

        {/* Stats summary */}
        <div className="mt-12 flex justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div
              className="text-4xl md:text-5xl font-display font-bold text-white"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              {currentDrivers.length}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">Pilotos</div>
          </div>
          <div className="text-center">
            <div
              className="text-4xl md:text-5xl font-display font-bold text-[#ff4422]"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              {activeTab === 'pro' ? '50' : '30'}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">Corridas</div>
          </div>
          <div className="text-center">
            <div
              className="text-4xl md:text-5xl font-display font-bold text-white"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              12
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">Etapas</div>
          </div>
        </div>
      </div>

      {/* Side decorations */}
      <div className="absolute left-0 top-1/3 w-1 h-32 bg-[#ff4422]/50" />
      <div className="absolute right-0 bottom-1/3 w-1 h-24 bg-white/20" />
    </section>
  );
}

export default Drivers;
