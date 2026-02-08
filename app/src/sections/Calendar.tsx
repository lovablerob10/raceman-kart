import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { GlitchCard } from '../components/GlitchCard';
import { supabase, type Stage as DBStage } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface Stage {
  day: string;
  month: string;
  name: string;
  location: string;
  active: boolean;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function Calendar() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch stages from Supabase
  useEffect(() => {
    const fetchStages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .order('stage_number');

      if (error) {
        console.error('Error fetching stages:', error);
      } else if (data) {
        setStages(data.map((s: DBStage) => {
          const date = new Date(s.date);
          return {
            day: date.getDate().toString().padStart(2, '0'),
            month: MONTHS[date.getMonth()],
            name: s.name,
            location: s.location,
            active: s.is_active
          };
        }));
      }
      setLoading(false);
    };
    fetchStages();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Cards stagger animation
      const cards = cardsContainerRef.current?.querySelectorAll('.stage-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );
      }

      // Racing stripe animation
      gsap.to('.racing-stripe-calendar', {
        backgroundPosition: '200% 0',
        duration: 3,
        repeat: -1,
        ease: 'none'
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollCards = (direction: 'left' | 'right') => {
    const container = cardsContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section
      ref={sectionRef}
      id="calendar"
      className="py-16 md:py-24 bg-gray-50 dark:bg-[#1a1a1a] relative overflow-hidden"
    >
      {/* Racing stripe decoration */}
      <div
        className="racing-stripe-calendar absolute top-0 left-0 right-0 h-2"
        style={{
          background: 'linear-gradient(90deg, #ff4422 0%, #ff4422 25%, white 25%, white 30%, #ff4422 30%, #ff4422 35%, white 35%, white 40%, #ff4422 40%, #ff4422 100%)',
          backgroundSize: '200% 100%'
        }}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase italic text-[#303285] dark:text-white flex items-center"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            <span className="w-2 h-10 bg-[#ff4422] mr-4 inline-block transform -skew-x-12" />
            Etapas 2026
          </h2>

          {/* Navigation arrows - IMPROVED VISIBILITY */}
          <div className="flex space-x-3">
            <button
              onClick={() => scrollCards('left')}
              className="p-3 bg-[#303285] text-white rounded-full shadow-lg 
                         border-2 border-transparent
                         hover:bg-[#ff4422] hover:border-[#ff4422] hover:shadow-[#ff4422]/30 hover:shadow-xl
                         active:scale-95
                         transition-all duration-300"
              aria-label="Etapa anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scrollCards('right')}
              className="p-3 bg-[#303285] text-white rounded-full shadow-lg 
                         border-2 border-transparent
                         hover:bg-[#ff4422] hover:border-[#ff4422] hover:shadow-[#ff4422]/30 hover:shadow-xl
                         active:scale-95
                         transition-all duration-300"
              aria-label="Próxima etapa"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Cards container */}
        <div
          ref={cardsContainerRef}
          className="flex overflow-x-auto space-x-6 pb-6 px-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {stages.map((stage, index) => (
            <GlitchCard
              key={index}
              className="stage-card snap-start flex-shrink-0"
              intensity={stage.active ? 'high' : 'low'}
            >
              {/* UNIFORM SIZE CARD with Flexbox */}
              <div
                className={`
                  bg-white dark:bg-[#262626] rounded-xl overflow-hidden
                  border border-gray-100 dark:border-gray-700
                  w-56 h-72
                  flex flex-col
                  shadow-md
                  transition-all duration-300 ease-out
                  hover:shadow-xl hover:-translate-y-2
                  ${stage.active ? 'ring-2 ring-[#ff4422] shadow-lg shadow-[#ff4422]/10' : ''}
                `}
              >
                {/* Top stripe */}
                <div
                  className={`h-2 flex-shrink-0 ${stage.active ? 'bg-[#ff4422]' : 'bg-gray-300 dark:bg-gray-600'}`}
                />

                {/* Card content with flex-grow for uniform spacing */}
                <div className="p-5 text-center flex flex-col flex-grow">
                  {/* Date Section - fixed height */}
                  <div className="flex-shrink-0">
                    <div className="flex items-baseline justify-center">
                      <span
                        className={`font-display font-bold text-6xl leading-none ${stage.active ? 'text-[#ff4422]' : 'text-gray-800 dark:text-gray-200'
                          }`}
                        style={{ fontFamily: 'Teko, sans-serif' }}
                      >
                        {stage.day}
                      </span>
                    </div>
                    <div
                      className="text-gray-500 dark:text-gray-400 font-display text-2xl uppercase tracking-widest mt-1"
                      style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                      {stage.month}
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700 my-3 flex-shrink-0" />

                  {/* Stage info - grows to fill space */}
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="text-base font-bold text-gray-800 dark:text-white uppercase mb-1 flex items-center justify-center gap-2">
                      <CalendarIcon className="text-[#ff4422] flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                      {stage.name}
                    </div>
                    <div
                      className={`font-display text-xl uppercase flex items-center justify-center gap-2 ${stage.active ? 'text-[#ff4422]' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                      <MapPin size={16} className="flex-shrink-0" />
                      {stage.location}
                    </div>
                  </div>

                  {/* Active indicator - fixed at bottom */}
                  <div className="flex-shrink-0 h-10 flex items-center justify-center">
                    {stage.active ? (
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 
                                   bg-[#ff4422] text-white rounded-full text-sm font-bold uppercase
                                   shadow-lg shadow-[#ff4422]/30
                                   hover:bg-[#ff6644] hover:shadow-xl hover:shadow-[#ff4422]/40
                                   transition-all duration-300
                                   transform hover:scale-105"
                        style={{ fontFamily: 'Teko, sans-serif', letterSpacing: '0.05em' }}
                      >
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Próxima Etapa
                      </button>
                    ) : (
                      <div className="h-8" /> /* Spacer for non-active cards */
                    )}
                  </div>
                </div>
              </div>
            </GlitchCard>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${stage.active ? 'bg-[#ff4422] w-8' : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#ff4422]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#303285]/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}

export default Calendar;
