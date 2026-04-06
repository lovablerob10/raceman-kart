import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MAX_AUDIO_LOOPS = 3;

/**
 * RealKartExperience - Seção imersiva com vídeo de kart
 *
 * Audio approach:
 *   - A floating sound button appears when the title fades out
 *   - User clicks to toggle sound ON (browser requires user gesture)
 *   - After 3 video loops, sound auto-mutes
 *   - Button stays visible so user can re-enable if desired
 */
export function RealKartExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showContent, setShowContent] = useState(true);
  const showContentRef = useRef(true);

  // ── Audio state ──
  const [audioOn, setAudioOn] = useState(false);
  const [showSoundBtn, setShowSoundBtn] = useState(false);
  const loopCountRef = useRef(0);

  // ── Toggle audio (user click = browser gesture = always works) ──
  const toggleAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (audioOn) {
      // Turn OFF
      video.muted = true;
      video.playbackRate = 0.4;
      setAudioOn(false);
    } else {
      // Turn ON — user clicked so browser allows unmute
      video.muted = false;
      video.playbackRate = 1.0;
      loopCountRef.current = 0;
      video.play().catch(() => {
        // Fallback: re-mute if still blocked
        video.muted = true;
        video.playbackRate = 0.4;
      });
      setAudioOn(true);
    }
  }, [audioOn]);

  // ── Loop detection → auto-mute after 3 loops ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastTime = 0;

    const onTimeUpdate = () => {
      if (!audioOn) return;
      // Detect loop: current time jumped backwards
      if (video.currentTime < lastTime - 1) {
        loopCountRef.current += 1;
        if (loopCountRef.current >= MAX_AUDIO_LOOPS) {
          video.muted = true;
          video.playbackRate = 0.4;
          setAudioOn(false);
        }
      }
      lastTime = video.currentTime;
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [audioOn]);

  // ── Video init ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      video.playbackRate = 0.4;
      video.play().catch(() => {});
    };

    if (video.readyState >= 1) {
      handleReady();
    } else {
      video.addEventListener('loadedmetadata', handleReady);
      return () => video.removeEventListener('loadedmetadata', handleReady);
    }
  }, []);

  // ── GSAP scroll animations ──
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const ctx = gsap.context(() => {
      // Title entrance animation
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

      // Scroll trigger for content visibility
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress > 0.05 && showContentRef.current) {
            gsap.to(title, { opacity: 0, y: -50, duration: 0.3 });
            setShowContent(false);
            showContentRef.current = false;
            setShowSoundBtn(true);
          } else if (progress <= 0.05 && !showContentRef.current) {
            gsap.to(title, { opacity: 1, y: 0, duration: 0.3 });
            setShowContent(true);
            showContentRef.current = true;
            setShowSoundBtn(false);
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
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen z-[5] overflow-hidden">

        {/* 1. Video Layer */}
        <div className="absolute inset-0 overflow-hidden" style={{ background: '#000' }}>
          <video
            ref={videoRef}
            src="/video/kart-video.mp4"
            className="w-full h-full object-cover"
            preload="auto"
            muted
            loop
            playsInline
            autoPlay
          />
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%)'
            }}
          />
        </div>

        {/* 2. Brightness Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
          }}
        />

        {/* 3. Title/Intro Overlay */}
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

        {/* 4. Floating Sound Toggle Button */}
        <button
          onClick={toggleAudio}
          className={`absolute bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-xl cursor-pointer transition-all duration-500 group ${
            showSoundBtn
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          } ${
            audioOn
              ? 'bg-[#F5B500]/30 border-[#F5B500]/60 shadow-[0_0_30px_rgba(245,181,0,0.4)]'
              : 'bg-white/10 border-white/20 shadow-lg hover:bg-white/20 hover:border-white/40'
          }`}
          aria-label={audioOn ? 'Desativar som' : 'Ativar som do motor'}
        >
          {audioOn ? (
            <Volume2 className="w-6 h-6 text-[#F5B500] animate-pulse" />
          ) : (
            <VolumeX className="w-6 h-6 text-white/80 group-hover:text-white" />
          )}
          <span
            className={`text-sm font-black uppercase tracking-widest ${
              audioOn ? 'text-[#F5B500]' : 'text-white/80 group-hover:text-white'
            }`}
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            {audioOn ? 'SOM LIGADO' : 'ATIVAR SOM'}
          </span>
          {!audioOn && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F5B500] rounded-full animate-ping" />
          )}
        </button>

        {/* Dynamic Progress line */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="h-1 bg-gradient-to-r from-[#2E6A9C] via-[#F5B500] to-[#FFD700]" />
        </div>

      </div>
    </section>
  );
}

export default RealKartExperience;
