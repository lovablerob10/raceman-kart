import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
  layers?: {
    image?: string;
    color?: string;
    speed: number;
    opacity?: number;
  }[];
  showTireTracks?: boolean;
  showCheckeredFlag?: boolean;
}

export function ParallaxBackground({
  children,
  className = '',
  layers = [],
  showTireTracks = false,
  showCheckeredFlag = false
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      layers.forEach((layer, index) => {
        const layerEl = layerRefs.current[index];
        if (!layerEl) return;

        gsap.to(layerEl, {
          yPercent: layer.speed * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: layer.speed,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [layers]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Parallax layers */}
      {layers.map((layer, index) => (
        <div
          key={index}
          ref={el => { layerRefs.current[index] = el; }}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: layer.image ? `url(${layer.image})` : undefined,
            backgroundColor: layer.color,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: layer.opacity ?? 1,
            zIndex: index - layers.length,
          }}
        />
      ))}

      {/* Tire tracks overlay */}
      {showTireTracks && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10 z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 15px,
              rgba(0,0,0,0.3) 15px,
              rgba(0,0,0,0.3) 17px,
              transparent 17px,
              transparent 32px,
              rgba(0,0,0,0.3) 32px,
              rgba(0,0,0,0.3) 34px
            )`,
            backgroundSize: '50px 100%'
          }}
        />
      )}

      {/* Checkered flag pattern */}
      {showCheckeredFlag && (
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #000 25%, transparent 25%),
              linear-gradient(-45deg, #000 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #000 75%),
              linear-gradient(-45deg, transparent 75%, #000 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.5
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Simplified parallax layer component
interface ParallaxLayerProps {
  speed?: number;
  children: React.ReactNode;
  className?: string;
}

export function ParallaxLayer({ speed = 0.5, children, className = '' }: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const ctx = gsap.context(() => {
      gsap.to(layer, {
        yPercent: speed * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: layer.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: speed,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={layerRef}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

// Racing stripes component
interface RacingStripesProps {
  position?: 'top' | 'bottom';
  color?: string;
  animated?: boolean;
}

export function RacingStripes({
  position = 'top',
  color = '#F5B500',
  animated = true
}: RacingStripesProps) {
  return (
    <div
      className={`absolute left-0 right-0 h-3 ${position === 'top' ? 'top-0' : 'bottom-0'}`}
      style={{
        background: `linear-gradient(90deg, 
          ${color} 0%, ${color} 25%, 
          white 25%, white 30%, 
          ${color} 30%, ${color} 35%,
          white 35%, white 40%,
          ${color} 40%, ${color} 100%
        )`,
        animation: animated ? 'stripe-shimmer 3s linear infinite' : undefined,
        backgroundSize: '200% 100%'
      }}
    >
      <style>{`
        @keyframes stripe-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default ParallaxBackground;
