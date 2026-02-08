import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, User } from 'lucide-react';
import { GlitchCard } from '../components/GlitchCard';
import { supabase, type News as DBNews } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  author: string;
}

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch news from Supabase
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching news:', error);
      } else if (data) {
        setNews(data.map((n: DBNews) => {
          const date = new Date(n.published_at);
          return {
            id: n.id,
            title: n.title,
            date: `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`,
            excerpt: n.excerpt || '',
            image: n.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
            author: n.author
          };
        }));
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation with scale
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Cards flip animation
      const cards = cardsRef.current?.querySelectorAll('.news-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, rotationY: -90 },
          {
            opacity: 1,
            rotationY: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="news"
      className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background decoration - Premium Racing style */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5B500]/10 via-transparent to-black opacity-50" />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F5B500]/50 to-transparent"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2E6A9C]/50 to-transparent"
        />
      </div>

      {/* Tire track background pattern */}
      <div
        className="absolute inset-0 opacity-5 tire-tracks-bg pointer-events-none"
      />

      {/* Floating racing accents */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#F5B500]/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#2E6A9C]/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2
              ref={titleRef}
              className="text-5xl md:text-7xl font-display font-black uppercase italic text-white flex items-center leading-none tracking-tighter"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              <span className="w-3 h-12 md:h-16 bg-[#F5B500] mr-4 inline-block transform -skew-x-12 shadow-[0_0_20px_rgba(245,181,0,0.6)]" />
              Notícias do Paddock
            </h2>
            <p className="text-gray-400 mt-4 text-xl font-medium tracking-wide uppercase italic" style={{ fontFamily: 'Teko, sans-serif' }}>
              Acompanhe os bastidores e os resultados da temporada
            </p>
          </div>

          <a
            href="#"
            className="group inline-flex items-center gap-4 bg-white/5 hover:bg-[#F5B500] text-white px-8 py-3 rounded-xl border border-white/10 hover:border-[#F5B500] transition-all duration-500 shadow-2xl backdrop-blur-md"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            <span className="text-2xl font-bold uppercase italic tracking-wider">Ver Arquivo Completo</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
          </a>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[450px] bg-white/5 rounded-2xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
            style={{ perspective: '2000px' }}
          >
            {news.map((item) => (
              <GlitchCard
                key={item.id}
                className="news-card h-full"
                intensity="medium"
                glitchColor1="#F5B500"
                glitchColor2="#2E6A9C"
              >
                <article
                  className="
                    relative group
                    bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden
                    h-[450px] flex flex-col
                    border border-white/10 hover:border-white/30
                    shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                    transition-all duration-500 cubic-bezier(0.34,1.56,0.64,1)
                    hover:shadow-[0_20px_60px_rgba(245,181,0,0.15)]
                    hover:-translate-y-3
                  "
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

                    {/* Category/Tag Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#F5B500] text-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm skew-x-[-15deg] shadow-lg">
                        RACE REPORT
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#F5B500] mb-3">
                      <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                        <Clock size={12} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                        <User size={12} />
                        {item.author}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-display font-bold text-2xl leading-[1.1] mb-4 text-white group-hover:text-[#F5B500] transition-colors line-clamp-3 min-h-[4.5rem]"
                      style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {item.excerpt}
                    </p>

                    {/* Read More link */}
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[#F5B500] font-black italic tracking-widest text-lg group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                      >
                        LEIA MAIS <ArrowRight size={20} />
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 bg-[#F5B500] rounded-full animate-ping" />
                      </div>
                    </div>
                  </div>

                  {/* Racing stripe bottom accent */}
                  <div
                    className="h-1 w-full bg-[#F5B500] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-[0_0_10px_#F5B500]"
                  />
                </article>
              </GlitchCard>
            ))}
          </div>
        )}
      </div>

      {/* Premium Side decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-48 bg-gradient-to-b from-[#F5B500] to-transparent z-20 opacity-40 shadow-[0_0_15px_#F5B500]" />
      <div className="absolute right-0 top-1/4 w-1.5 h-32 bg-gradient-to-t from-[#2E6A9C] to-transparent z-20 opacity-40" />
    </section>

  );
}

export default News;
