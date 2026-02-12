import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlitchCard } from '../components/GlitchCard';

gsap.registerPlugin(ScrollTrigger);

import { supabase, type Pilot } from '../lib/supabase';

export function Drivers() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'PRO' | 'LIGHT'>('PRO');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      if (!isLoading) {
        animateGrid();
      }

    }, section);

    return () => ctx.revert();
  }, [isLoading]);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      const { data, error } = await supabase
        .from('pilots')
        .select('*')
        .order('name');

      if (error) throw error;
      if (data) setPilots(data);
    } catch (err) {
      console.error('Error fetching pilots:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleTabChange = (tab: 'PRO' | 'LIGHT') => {
    if (tab === activeTab) return;

    // Reset scroll when changing tabs
    if (gridRef.current) {
      gridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }

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
    } else {
      setActiveTab(tab);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (gridRef.current) {
      const scrollAmount = gridRef.current.clientWidth * 0.8;
      gridRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const currentDrivers = pilots.filter(p => p.category === activeTab);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="py-20 md:py-32 bg-[#080808] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#2E6A9C]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F5B500]/10 to-transparent" />

        {/* Animated grid/racing lines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
            transformOrigin: 'top center'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-5xl md:text-8xl font-display font-black uppercase italic text-white flex items-center justify-center leading-none tracking-tighter"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            <span className="w-3 h-12 md:h-16 bg-[#F5B500] mr-4 inline-block transform -skew-x-12 shadow-[0_0_15px_#F5B500]" />
            Grid de Pilotos
          </h2>
          <p className="text-gray-400 mt-4 text-xl font-medium tracking-widest uppercase italic" style={{ fontFamily: 'Teko, sans-serif' }}>
            Os Protagonistas da Velocidade
          </p>
        </div>

        {/* Premium Racing Tabs */}
        <div
          ref={tabsRef}
          className="flex justify-center mb-16"
        >
          <div className="bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 flex gap-2">
            <button
              onClick={() => handleTabChange('PRO')}
              className={`
                px-10 py-3 font-display uppercase text-2xl font-bold italic rounded-xl transition-all duration-500
                ${activeTab === 'PRO'
                  ? 'bg-gradient-to-r from-[#F5B500] to-[#FFD700] text-black shadow-[0_10px_30px_rgba(245,181,0,0.4)] scale-105'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }
              `}
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              CATEGORIA OURO
            </button>
            <button
              onClick={() => handleTabChange('LIGHT')}
              className={`
                px-10 py-3 font-display uppercase text-2xl font-bold italic rounded-xl transition-all duration-500
                ${activeTab === 'LIGHT'
                  ? 'bg-gradient-to-r from-[#2E6A9C] to-[#3b82f6] text-white shadow-[0_10px_30px_rgba(46,106,156,0.4)] scale-105'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }
              `}
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              CATEGORIA PRATA
            </button>
          </div>
        </div>

        {/* Drivers Carousel Container */}
        <div className="relative group/carousel px-4 md:px-12">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 -translate-x-4 group-hover/carousel:translate-x-0 hidden md:flex items-center justify-center hover:bg-[#F5B500] hover:text-black"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 translate-x-4 group-hover/carousel:translate-x-0 hidden md:flex items-center justify-center hover:bg-[#F5B500] hover:text-black"
          >
            <ChevronRight size={32} />
          </button>

          {/* Visual Fade Endings */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#080808] to-transparent z-20 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#080808] to-transparent z-20 pointer-events-none hidden md:block" />

          {/* Scrolling Area */}
          <div
            ref={gridRef}
            className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-10"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {currentDrivers.map((driver) => {
              const driverColor = activeTab === 'PRO' ? '#F5B500' : '#2E6A9C';
              const driverImage = driver.photo_url || 'https://images.unsplash.com/photo-1530648672449-81f6c723e2c1?q=80&w=800&auto=format&fit=crop';

              return (
                <div key={driver.id} className="min-w-[260px] md:min-w-[320px] snap-center driver-card">
                  <GlitchCard
                    intensity="low"
                    glitchColor1={driverColor}
                    glitchColor2="#ffffff"
                  >
                    <div className="relative group cursor-pointer bg-[#101010] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl">
                      {/* Driver Identity Plate */}
                      <div className="relative aspect-[3/4.5] overflow-hidden">
                        <img
                          src={driverImage}
                          alt={driver.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-115"
                          loading="lazy"
                        />

                        {/* High-end gradient mask */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20 opacity-80" />

                        {/* Racing Number with Glow */}
                        <div className="absolute -bottom-4 -left-4">
                          <div
                            className="text-white font-display text-8xl font-black italic leading-none opacity-20 group-hover:opacity-40 transition-opacity duration-500 select-none"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                          >
                            {driver.number}
                          </div>
                        </div>

                        {/* Floating Number Accent */}
                        <div className="absolute top-4 right-4">
                          <div
                            className="text-white font-display text-3xl font-bold italic bg-black/40 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-lg border border-white/20 shadow-xl"
                            style={{
                              fontFamily: 'Teko, sans-serif',
                              color: driverColor,
                              boxShadow: `0 0 20px ${driverColor}40`
                            }}
                          >
                            {driver.number || '00'}
                          </div>
                        </div>

                        {/* Interaction Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Name Label - Slanted style */}
                      <div
                        className="relative py-4 px-3 text-center transition-all duration-500 bg-[#1a1a1a]"
                      >
                        <div
                          className="absolute inset-y-0 left-0 w-1.5 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          style={{ background: driverColor }}
                        />
                        <div className="text-white font-display text-xl leading-none uppercase italic font-bold tracking-tight truncate" style={{ fontFamily: 'Teko, sans-serif' }}>
                          {driver.name}
                        </div>
                        <div className="text-[9px] text-white/30 font-black tracking-widest uppercase mt-1">SQUADRA CORSE</div>
                      </div>
                    </div>
                  </GlitchCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Stats Summary */}
        <div className="mt-24 max-w-4xl mx-auto p-10 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center group">
              <div
                className="text-5xl md:text-7xl font-display font-black text-white leading-none group-hover:scale-110 group-hover:text-[#F5B500] transition-all duration-500"
                style={{ fontFamily: 'Teko, sans-serif' }}
              >
                {currentDrivers.length}
              </div>
              <div className="text-white/40 text-xs md:text-sm uppercase font-black tracking-[0.2em] mt-2">Pilotos Confirmados</div>
            </div>
            <div className="text-center group">
              <div
                className="text-5xl md:text-7xl font-display font-black text-[#F5B500] leading-none group-hover:scale-110 transition-all duration-500"
                style={{ fontFamily: 'Teko, sans-serif', textShadow: '0 0 30px rgba(245,181,0,0.3)' }}
              >
                {activeTab === 'PRO' ? '52' : '34'}
              </div>
              <div className="text-white/40 text-xs md:text-sm uppercase font-black tracking-[0.2em] mt-2">Corridas Disputadas</div>
            </div>
            <div className="text-center group">
              <div
                className="text-5xl md:text-7xl font-display font-black text-white leading-none group-hover:scale-110 group-hover:text-[#2E6A9C] transition-all duration-500"
                style={{ fontFamily: 'Teko, sans-serif' }}
              >
                12
              </div>
              <div className="text-white/40 text-xs md:text-sm uppercase font-black tracking-[0.2em] mt-2">Etapas no Calendário</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative linear accents */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </section>

  );
}

export default Drivers;
