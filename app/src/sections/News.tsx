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
      className="py-16 md:py-24 bg-[#ff4422] relative overflow-hidden"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.1) 10px,
            rgba(0,0,0,0.1) 20px
          )`
        }}
      />

      {/* Animated circles */}
      <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white/20 rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white/10 rounded-full"
        style={{ animation: 'pulse 3s ease-in-out infinite' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase italic text-white text-center mb-12"
          style={{ fontFamily: 'Teko, sans-serif' }}
        >
          Últimas Notícias
        </h2>

        {/* News Grid - UNIFORM HEIGHT with items-stretch */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
          style={{ perspective: '1000px' }}
        >
          {news.map((item) => (
            <GlitchCard
              key={item.id}
              className="news-card h-full"
              intensity="medium"
              glitchColor1="#ffffff"
              glitchColor2="#ffd700"
            >
              {/* UNIFORM CARD with Fixed Height */}
              <article
                className="
                  bg-white dark:bg-[#262626] rounded-xl overflow-hidden
                  h-[420px] flex flex-col
                  shadow-md
                  transition-all duration-300 ease-out
                  hover:shadow-xl hover:-translate-y-2
                  group cursor-pointer
                "
              >
                {/* Image - Fixed height */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Read more overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-[#ff4422] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                      Ler mais <ArrowRight size={16} />
                    </span>
                  </div>
                </div>

                {/* Content - Flex grow to fill remaining space */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Title - Fixed area */}
                  <h3
                    className="font-display font-bold text-xl leading-tight mb-3 text-[#303285] dark:text-white group-hover:text-[#ff4422] transition-colors line-clamp-2 min-h-[3.5rem]"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                  >
                    {item.title}
                  </h3>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3 flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {item.author}
                    </span>
                  </div>

                  {/* Excerpt - Grows to fill space */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
                    {item.excerpt}
                  </p>
                </div>

                {/* Bottom accent - Fixed at bottom */}
                <div className="h-1 bg-gradient-to-r from-[#ff4422] to-[#ffd700] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left flex-shrink-0" />
              </article>
            </GlitchCard>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center text-white font-display uppercase text-2xl hover:underline group"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            Ver todas as notícias
            <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={28} />
          </a>
        </div>
      </div>

      {/* Side decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-white/30" />
      <div className="absolute right-0 top-1/3 w-1 h-24 bg-white/20" />
    </section>
  );
}

export default News;
