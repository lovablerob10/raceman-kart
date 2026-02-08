import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface GlitchCardProps {
  children: React.ReactNode;
  className?: string;
  glitchColor1?: string;
  glitchColor2?: string;
  intensity?: 'low' | 'medium' | 'high';
  onHover?: () => void;
}

export function GlitchCard({
  children,
  className = '',
  glitchColor1 = '#F5B500',
  glitchColor2 = '#2E6A9C',
  intensity = 'medium',
  onHover
}: GlitchCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sparkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const intensityConfig = {
    low: { duration: 0.5, frequency: 200 },
    medium: { duration: 0.3, frequency: 100 },
    high: { duration: 0.15, frequency: 50 }
  };

  const createSpark = useCallback((x: number, y: number) => {
    const card = cardRef.current;
    if (!card) return;

    const spark = document.createElement('div');
    spark.className = 'absolute w-1 h-1 rounded-full pointer-events-none';
    spark.style.cssText = `
      background: radial-gradient(circle, #ffd700 0%, #ff6b35 100%);
      left: ${x}px;
      top: ${y}px;
      box-shadow: 0 0 6px #ffd700;
    `;
    card.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40 + 20;

    gsap.to(spark, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20,
      opacity: 0,
      scale: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => spark.remove()
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.();

    const card = cardRef.current;
    if (!card) return;

    // Create sparks periodically
    const config = intensityConfig[intensity];
    sparkIntervalRef.current = setInterval(() => {
      const rect = card.getBoundingClientRect();
      createSpark(
        Math.random() * rect.width,
        Math.random() * rect.height * 0.3
      );
    }, config.frequency);

    // Acceleration pulse animation
    gsap.to(card, {
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out'
    });

    // Add speed lines
    addSpeedLines();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    const card = cardRef.current;
    if (!card) return;

    if (sparkIntervalRef.current) {
      clearInterval(sparkIntervalRef.current);
    }

    gsap.to(card, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const addSpeedLines = () => {
    const card = cardRef.current;
    if (!card) return;

    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      line.className = 'absolute h-px pointer-events-none';
      line.style.cssText = `
        background: linear-gradient(90deg, transparent, ${glitchColor1}, transparent);
        width: 60px;
        left: -60px;
        top: ${20 + i * 30}%;
        opacity: 0;
      `;
      card.appendChild(line);

      gsap.timeline()
        .to(line, {
          x: card.offsetWidth + 120,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.in',
          delay: i * 0.05
        })
        .to(line, {
          opacity: 0,
          duration: 0.1,
          onComplete: () => line.remove()
        });
    }
  };

  const config = intensityConfig[intensity];

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        boxShadow: isHovered
          ? `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${glitchColor1}40`
          : '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Glitch overlay layers */}
      {isHovered && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-20 mix-blend-screen"
            style={{
              background: `linear-gradient(90deg, ${glitchColor1}20 0%, transparent 50%, ${glitchColor2}20 100%)`,
              animation: `glitch-1 ${config.duration}s linear infinite`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none z-20 mix-blend-multiply"
            style={{
              background: `linear-gradient(90deg, ${glitchColor2}15 0%, transparent 50%, ${glitchColor1}15 100%)`,
              animation: `glitch-2 ${config.duration}s linear infinite`,
            }}
          />
        </>
      )}

      {/* Scan lines effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-30 opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            animation: 'scanline 0.5s linear infinite'
          }}
        />
      )}

      {/* Corner accents on hover */}
      {isHovered && (
        <>
          <div
            className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 pointer-events-none z-40"
            style={{ borderColor: glitchColor1 }}
          />
          <div
            className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 pointer-events-none z-40"
            style={{ borderColor: glitchColor2 }}
          />
          <div
            className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 pointer-events-none z-40"
            style={{ borderColor: glitchColor2 }}
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 pointer-events-none z-40"
            style={{ borderColor: glitchColor1 }}
          />
        </>
      )}

      <style>{`
        @keyframes scanline {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}

export default GlitchCard;
