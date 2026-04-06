import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RealKartVideo } from '../components/RealKartVideo';

gsap.registerPlugin(ScrollTrigger);

const MAX_AUDIO_LOOPS = 3;

/**
 * RealKartExperience - Seção imersiva com vídeo Remotion
 * Controlado pelo scroll do usuário com sync frame-a-frame
 *
 * Audio behaviour:
 *   1. Starts muted (browser policy)
 *   2. When the title text scrolls away, audio unmutes
 *   3. After 3 video loops, audio mutes again automatically
 *   4. If the user scrolls back up (title reappears), counter resets
 */
export function RealKartExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(true);
  const showContentRef = useRef(true);

  // ── Audio state ──
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioCompletedRef = useRef(false); // true after 3 loops, prevents re-enabling

  // Called by RealKartVideo each time the video loops
  const handleLoopCount = useCallback((count: number) => {
    if (count >= MAX_AUDIO_LOOPS) {
      setAudioEnabled(false);
      audioCompletedRef.current = true; // don't re-enable until user scrolls back up
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const ctx = gsap.context(() => {
      // Title animation (Initial)
      gsap.fromTo(title,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Scroll trigger for content visibility (text fades out on scroll)
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;

          // Hide/show title based on progress
          if (progress > 0.05 && showContentRef.current) {
            gsap.to(title, { opacity: 0, y: -50, duration: 0.3 });
            setShowContent(false);
            showContentRef.current = false;

            // Enable audio when title disappears (if not already completed 3 loops)
            if (!audioCompletedRef.current) {
              setAudioEnabled(true);
            }
          } else if (progress <= 0.05 && !showContentRef.current) {
            gsap.to(title, { opacity: 1, y: 0, duration: 0.3 });
            setShowContent(true);
            showContentRef.current = true;

            // Title reappeared — mute and reset loop cycle
            setAudioEnabled(false);
            audioCompletedRef.current = false;
          }
        }
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] bg-black"
    >
      {/* Sticky Container - Holds everything that stays on screen during scroll */}
      <div className="sticky top-0 h-screen z-[5] overflow-hidden">

        {/* 1. The Video Layer */}
        <RealKartVideo
          progress={0}
          className="w-full h-full"
          audioEnabled={audioEnabled}
          onLoopCount={handleLoopCount}
        />

        {/* 2. Brightness Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
          }}
        />

        {/* 3. Title/Intro Overlay (Fades out) */}
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-700 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        >
          <div
            ref={titleRef}
            className="text-center px-4"
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-[#F5B500]/20 border border-[#F5B500]/40 px-6 py-2 rounded-full mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(245,181,0,0.3)]">
              <span className="w-2.5 h-2.5 bg-[#F5B500] rounded-full animate-ping" />
              <span className="text-white font-display text-lg uppercase font-black tracking-[0.3em]" style={{ fontFamily: 'Teko, sans-serif' }}>
                Experiência Imersiva 360°
              </span>
            </div>

            {/* Cinematic Title */}
            <h2
              className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase italic text-white mb-6 leading-none tracking-tighter"
              style={{
                fontFamily: 'Teko, sans-serif',
                textShadow: '0 10px 40px rgba(0,0,0,0.9)'
              }}
            >
              <span className="block opacity-80">SENSAÇÃO DE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F5B500] via-[#F5B500] to-white drop-shadow-[0_0_30px_rgba(245,181,0,0.5)]">
                PURA ADRENALINA
              </span>
            </h2>

            {/* Cinematic Subtitle */}
            <p
              className="text-xl md:text-2xl text-white/70 font-display font-medium max-w-3xl mx-auto mb-12 uppercase italic tracking-wide"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              Acelere a fundo. Controle cada curva. Sinta o asfalto.
              O controle está <span className="text-white font-black underline decoration-[#F5B500]">no seu scroll</span>.
            </p>

            {/* Premium Scroll indicator */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-1 h-32 bg-gradient-to-b from-transparent via-[#F5B500] to-transparent animate-[scroll-line_2s_infinite]" />
              <div className="relative">
                <div className="absolute inset-0 bg-[#F5B500] blur-xl opacity-20 animate-pulse" />
                <span className="relative z-10 text-white font-display text-2xl font-black uppercase italic tracking-[0.5em] border border-white/20 px-8 py-2 rounded-lg backdrop-blur-xl" style={{ fontFamily: 'Teko, sans-serif' }}>
                  SCROLL PARA ACELERAR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Progress line */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="h-1 bg-gradient-to-r from-[#2E6A9C] via-[#F5B500] to-[#FFD700]" />
        </div>


      </div>
    </section>
  );
}

export default RealKartExperience;
