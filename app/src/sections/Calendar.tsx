import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, MapPin, Sun, Moon } from 'lucide-react';
import { GlitchCard } from '../components/GlitchCard';
import { supabase, type Stage as DBStage } from '../lib/supabase';
import { TrackMap } from '../components/TrackMap';

gsap.registerPlugin(ScrollTrigger);

interface LocalStage extends Partial<DBStage> {
  day: string;
  month: string;
  name: string;
  location: string;
  active?: boolean;
  trainingDate?: string;
  raceDate?: string;
  period?: string;
  dayOfWeek?: string;
  time?: string;
  tire?: string;
  track_id?: string;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Complete 2026 Racing Season Schedule
const SEASON_2026: LocalStage[] = [
  { day: '28', month: 'Fev', name: 'Etapa 1', location: 'KNO', trainingDate: '21/02/26', raceDate: '28/02/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 01', track_id: 'KNO_A' },
  { day: '28', month: 'Mar', name: 'Etapa 2', location: 'KNO', trainingDate: '21/03/26', raceDate: '28/03/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 01', track_id: 'KNO_B' },
  { day: '25', month: 'Abr', name: 'Etapa 3', location: 'KNO', trainingDate: '18/04/26', raceDate: '25/04/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 01', track_id: 'KNO_A' },
  { day: '30', month: 'Mai', name: 'Etapa 4', location: 'KNO', trainingDate: '23/05/26', raceDate: '30/05/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 02', track_id: 'KNO_B' },
  { day: '25', month: 'Jun', name: 'Etapa 5', location: 'Paulínia', trainingDate: '24/06/26', raceDate: '25/06/26', period: 'Noturno', dayOfWeek: 'Quinta', time: '19:00 às 22:00', tire: 'PNEU 02', track_id: 'Paulínia' },
  { day: '25', month: 'Jul', name: 'Etapa 6', location: 'KNO', trainingDate: '18/07/26', raceDate: '25/07/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 02', track_id: 'KNO_A' },
  { day: '29', month: 'Ago', name: 'Etapa 7', location: 'KNO', trainingDate: '22/08/26', raceDate: '29/08/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 03', track_id: 'KNO_B' },
  { day: '26', month: 'Set', name: 'Etapa 8', location: 'KNO', trainingDate: '19/09/26', raceDate: '26/09/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 03', track_id: 'KNO_A' },
  { day: '24', month: 'Out', name: 'Etapa 9', location: 'KNO', trainingDate: '17/10/26', raceDate: '24/10/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 03', track_id: 'KNO_B' },
  { day: '12', month: 'Nov', name: 'Etapa 10', location: 'Paulínia', trainingDate: '11/11/26', raceDate: '12/11/26', period: 'Noturno', dayOfWeek: 'Quinta', time: '19:00 às 22:00', tire: 'PNEU 04', track_id: 'Paulínia' },
  { day: '12', month: 'Dez', name: 'Etapa 11', location: 'KNO', trainingDate: '05/12/26', raceDate: '12/12/26', period: 'Diurna', dayOfWeek: 'Sábado', time: '08:00 às 12:00', tire: 'PNEU 04', track_id: 'KNO_A' },
];

// Function to determine which stage is active based on current date
function getStagesWithDynamicActive(stages: LocalStage[]): LocalStage[] {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Sort by stage_number to ensure correct index-based active logic if needed
  const sorted = [...stages].sort((a, b) => (a.stage_number || 0) - (b.stage_number || 0));

  return sorted.map((stage, index) => {
    // Parse date (either DD/MM/YY from fallback or YYYY-MM-DD from DB)
    let raceDate: Date;
    if (stage.date && stage.date.includes('-')) {
      const [y, m, d] = stage.date.split('-').map(Number);
      raceDate = new Date(y, m - 1, d, 12, 0, 0);
    } else {
      const [day, month] = stage.raceDate?.split('/').map(Number) || [0, 0];
      raceDate = new Date(currentYear, month - 1, day);
    }

    // Find first upcoming race
    const isUpcoming = raceDate >= today;
    const previousStagesCompleted = sorted.slice(0, index).every(s => {
      let d: Date;
      if (s.date && s.date.includes('-')) {
        const [y, m, dayNum] = s.date.split('-').map(Number);
        d = new Date(y, m - 1, dayNum, 12, 0, 0);
      } else {
        const [day_f, month_f] = s.raceDate?.split('/').map(Number) || [0, 0];
        d = new Date(currentYear, month_f - 1, day_f);
      }
      return d < today;
    });

    return {
      ...stage,
      active: isUpcoming && previousStagesCompleted,
      track_id: stage.track_id || (stage.location === 'Paulínia' ? 'Paulínia' : (index % 2 === 0 ? 'KNO_A' : 'KNO_B'))
    };
  });
}

export function Calendar() {
  const [stages, setStages] = useState<LocalStage[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStage, setSelectedStage] = useState<LocalStage | null>(null);

  // Fetch stages from Supabase with local fallback
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data, error } = await supabase
          .from('stages')
          .select('*')
          .order('stage_number');

        if (error || !data || data.length === 0) {
          console.log('Using fallback 2026 season data');
          setStages(getStagesWithDynamicActive(SEASON_2026));
        } else {
          // Process database data with dynamic active flag
          const mappedData: LocalStage[] = data.map((s: DBStage) => {
            // Use split to avoid timezone shifts - treat as local date
            const [, monthStr, dayStr] = s.date.split('-');
            const monthIdx = parseInt(monthStr, 10) - 1;

            return {
              ...s,
              day: dayStr.padStart(2, '0'),
              month: MONTHS[monthIdx],
              name: s.name,
              location: s.location,
              period: s.period,
              track_id: s.track_id,
              time: s.time,
              tire: s.tire,
              trainingDate: s.training_date,
              dayOfWeek: s.day_of_week
            };
          });
          setStages(getStagesWithDynamicActive(mappedData));
        }
      } catch (err) {
        console.error('Error fetching stages:', err);
        setStages(getStagesWithDynamicActive(SEASON_2026));
      }
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
      className="py-32 md:py-48 bg-gray-50 dark:bg-[#1a1a1a] relative overflow-hidden"
    >
      {/* Racing stripe decoration */}
      <div
        className="racing-stripe-calendar absolute top-0 left-0 right-0 h-2"
        style={{
          background: 'linear-gradient(90deg, #F5B500 0%, #F5B500 25%, white 25%, white 30%, #F5B500 30%, #F5B500 35%, white 35%, white 40%, #F5B500 40%, #F5B500 100%)',
          backgroundSize: '200% 100%'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="relative">
            <h2
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase italic text-[#2E6A9C] dark:text-white flex items-center leading-none tracking-tighter"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              <span className="w-3 h-12 md:h-16 bg-[#F5B500] mr-4 inline-block transform -skew-x-12 shadow-[0_0_15px_rgba(245,181,0,0.5)]" />
              TEMPORADA 2026
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-[#F5B500] to-transparent mt-2 opacity-50" />
          </div>

          {/* Navigation arrows - RACING STYLE */}
          <div className="flex space-x-4 self-end md:self-auto">
            <button
              onClick={() => scrollCards('left')}
              className="group p-4 bg-white/5 dark:bg-white/10 backdrop-blur-md text-[#2E6A9C] dark:text-white rounded-xl 
                         border border-white/20 shadow-xl
                         hover:bg-[#F5B500] hover:text-white hover:border-[#F5B500] hover:shadow-[#F5B500]/40
                         active:scale-90
                         transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              aria-label="Etapa anterior"
            >
              <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollCards('right')}
              className="group p-4 bg-white/5 dark:bg-white/10 backdrop-blur-md text-[#2E6A9C] dark:text-white rounded-xl 
                         border border-white/20 shadow-xl
                         hover:bg-[#F5B500] hover:text-white hover:border-[#F5B500] hover:shadow-[#F5B500]/40
                         active:scale-90
                         transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              aria-label="Próxima etapa"
            >
              <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Cards container */}
        <div
          ref={cardsContainerRef}
          className="flex overflow-x-auto space-x-8 pb-12 px-4 scrollbar-hide snap-x snap-mandatory mask-fade-edges"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {stages.map((stage, index) => (
            <GlitchCard
              key={index}
              className="stage-card snap-start flex-shrink-0 cursor-pointer"
              intensity={stage.active ? 'high' : 'low'}
              onHover={() => { }}
            >
              <div
                onClick={() => setSelectedStage(stage)}
                className={`
                  relative group/card
                  bg-neutral-900/60 backdrop-blur-2xl rounded-3xl overflow-hidden
                  border transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                  w-80 h-[480px]
                  flex flex-col shadow-2xl
                  ${stage.active
                    ? 'border-[#F5B500] shadow-[#F5B500]/20 scale-[1.03] z-10'
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:border-[#2E6A9C]/50 hover:scale-[1.01]'
                  }
                `}
              >
                {/* Stage Number Watermark */}
                <div
                  className="absolute -top-4 -right-4 text-[11rem] font-black italic text-white/[0.03] leading-none pointer-events-none select-none z-0"
                  style={{ fontFamily: 'Teko, sans-serif' }}
                >
                  {(stage.stage_number || (index + 1)).toString().padStart(2, '0')}
                </div>

                {/* Status Badges */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#F5B500] font-black text-3xl italic leading-none" style={{ fontFamily: 'Teko, sans-serif' }}>
                      {stage.day} {stage.month.toUpperCase()}
                    </span>
                    <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
                      TEMPORADA 2026
                    </span>
                  </div>

                  {stage.active && (
                    <div className="bg-[#F5B500] text-black text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,181,0,0.5)] animate-pulse">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      PRÓXIMA ETAPA
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="mt-auto p-8 relative z-10">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white uppercase leading-tight mb-2 tracking-tight group-hover/card:text-[#F5B500] transition-colors">
                      {stage.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin size={16} className="text-[#2E6A9C]" />
                      <span className="text-lg font-medium italic" style={{ fontFamily: 'Teko, sans-serif' }}>{stage.location}</span>
                    </div>
                  </div>

                  {/* Technical Specs Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { label: 'HORÁRIO', value: stage.time || (stage.period === 'Noturno' ? '19:00' : '08:00'), icon: <Sun size={12} /> },
                      { label: 'PNEU', value: stage.tire?.replace('PNEU ', '') || 'MG', color: 'text-green-400' },
                      { label: 'TURNO', value: stage.period || 'DIURNO', icon: stage.period === 'Noturno' ? <Moon size={12} /> : <Sun size={12} /> }
                    ].map((spec, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
                        <span className="text-[8px] font-bold text-white/30 tracking-widest">{spec.label}</span>
                        <span className={`text-xs font-black ${spec.color || 'text-white'}`}>{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStage(stage);
                    }}
                    className={`
                      w-full py-4 rounded-xl text-lg font-black uppercase italic tracking-wider
                      transition-all duration-300 flex items-center justify-center gap-2
                      ${stage.active
                        ? 'bg-[#F5B500] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                        : 'bg-[#2E6A9C] text-white hover:bg-[#3a85c3]'
                      }
                    `}
                    style={{ fontFamily: 'Teko, sans-serif' }}
                  >
                    DETALHES DA ETAPA
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Background Glow */}
                {stage.active && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F5B500]/10 via-transparent to-transparent pointer-events-none" />
                )}
              </div>
            </GlitchCard>
          ))}
        </div>

        {/* Improved Progress Dots */}
        <div className="flex justify-center mt-4 gap-3">
          {stages.map((stage, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-500 
                ${stage.active
                  ? 'bg-[#F5B500] w-12 shadow-[0_0_10px_#F5B500]'
                  : 'bg-gray-300 dark:bg-gray-700 w-3 hover:bg-[#F5B500]/30'
                }`}
              onClick={() => {
                cardsContainerRef.current?.children[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
              }}
            />
          ))}
        </div>
      </div>


      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#F5B500]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#2E6A9C]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Track Visualization Modal */}
      {selectedStage && (
        <TrackMap
          stage={selectedStage as DBStage}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </section >
  );
}

export default Calendar;
