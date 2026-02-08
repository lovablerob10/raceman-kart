import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  fromColor?: string;
  toColor?: string;
  type?: 'wipe' | 'fade' | 'diagonal' | 'curtain';
}

/**
 * SectionTransition - Componente de transição cinematográfica entre seções
 * Cria efeitos de wipe, fade, diagonal ou curtain ao scrollar
 */
export function SectionTransition({
  fromColor = '#000000',
  toColor = '#E10600',
  type = 'diagonal'
}: SectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const ctx = gsap.context(() => {
      // Set initial state based on transition type
      switch (type) {
        case 'wipe':
          gsap.set(overlay, { scaleX: 0, transformOrigin: 'left center' });
          break;
        case 'diagonal':
          gsap.set(overlay, { 
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            background: `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`
          });
          break;
        case 'curtain':
          gsap.set(overlay, { scaleY: 0, transformOrigin: 'top center' });
          break;
        case 'fade':
          gsap.set(overlay, { opacity: 0 });
          break;
      }

      // Create scroll-triggered animation
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;

          switch (type) {
            case 'wipe':
              gsap.to(overlay, {
                scaleX: progress,
                duration: 0.1,
                ease: 'none'
              });
              break;
            case 'diagonal':
              const diagonalProgress = progress * 100;
              gsap.to(overlay, {
                clipPath: `polygon(0 0, ${diagonalProgress}% 0, ${diagonalProgress - 20}% 100%, 0 100%)`,
                duration: 0.1,
                ease: 'none'
              });
              break;
            case 'curtain':
              gsap.to(overlay, {
                scaleY: progress,
                duration: 0.1,
                ease: 'none'
              });
              break;
            case 'fade':
              gsap.to(overlay, {
                opacity: Math.sin(progress * Math.PI),
                duration: 0.1,
                ease: 'none'
              });
              break;
          }
        }
      });
    });

    return () => ctx.revert();
  }, [type, fromColor, toColor]);

  return (
    <div 
      ref={containerRef}
      className="h-32 relative overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      <div 
        ref={overlayRef}
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(90deg, ${fromColor} 0%, ${toColor} 100%)`
        }}
      />
      
      {/* Decorative elements based on type */}
      {type === 'diagonal' && (
        <>
          <div className="absolute top-0 left-0 w-full h-px bg-white/20" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/20" />
        </>
      )}
      
      {type === 'wipe' && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30" />
      )}
    </div>
  );
}

interface SplitTransitionProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * SplitTransition - Divide a tela em duas partes que se separam
 */
export function SplitTransition({ 
  children, 
  direction = 'horizontal',
  className = '' 
}: SplitTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!container || !top || !bottom) return;

    const ctx = gsap.context(() => {
      gsap.set(top, { 
        [direction === 'horizontal' ? 'y' : 'x']: 0 
      });
      gsap.set(bottom, { 
        [direction === 'horizontal' ? 'y' : 'x']: 0 
      });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 60%',
        end: 'top 20%',
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          const offset = progress * 100;

          gsap.to(top, {
            [direction === 'horizontal' ? 'y' : 'x']: -offset,
            duration: 0.1,
            ease: 'none'
          });
          gsap.to(bottom, {
            [direction === 'horizontal' ? 'y' : 'x']: offset,
            duration: 0.1,
            ease: 'none'
          });
        }
      });
    });

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div ref={topRef} className="relative z-10">
        {children}
      </div>
      <div 
        ref={bottomRef} 
        className="absolute inset-0 z-0 bg-gradient-to-b from-red-600 to-orange-500"
      />
    </div>
  );
}

interface RevealTransitionProps {
  children: React.ReactNode;
  revealFrom?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

/**
 * RevealTransition - Revela conteúdo a partir de uma direção
 */
export function RevealTransition({
  children,
  revealFrom = 'left',
  className = ''
}: RevealTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const mask = maskRef.current;
    if (!container || !content || !mask) return;

    // Set initial clip path based on reveal direction
    const getInitialClip = () => {
      switch (revealFrom) {
        case 'left': return 'inset(0 100% 0 0)';
        case 'right': return 'inset(0 0 0 100%)';
        case 'top': return 'inset(100% 0 0 0)';
        case 'bottom': return 'inset(0 0 100% 0)';
      }
    };

    gsap.set(mask, { clipPath: getInitialClip() });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          
          let clipPath;
          switch (revealFrom) {
            case 'left':
              clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;
              break;
            case 'right':
              clipPath = `inset(0 0 0 ${100 - progress * 100}%)`;
              break;
            case 'top':
              clipPath = `inset(${100 - progress * 100}% 0 0 0)`;
              break;
            case 'bottom':
              clipPath = `inset(0 0 ${100 - progress * 100}% 0)`;
              break;
          }

          gsap.to(mask, {
            clipPath,
            duration: 0.1,
            ease: 'none'
          });
        }
      });
    });

    return () => ctx.revert();
  }, [revealFrom]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={contentRef} className="relative z-0">
        {children}
      </div>
      <div 
        ref={maskRef} 
        className="absolute inset-0 z-10 bg-gradient-to-br from-red-600/20 to-orange-500/20"
      />
    </div>
  );
}

export default SectionTransition;
