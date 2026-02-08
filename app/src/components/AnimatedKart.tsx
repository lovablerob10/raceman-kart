import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedKartProps {
  containerRef: React.RefObject<HTMLElement | null>;
  direction?: 'left-to-right' | 'right-to-left';
  color?: string;
}

export function AnimatedKart({ 
  containerRef, 
  direction = 'left-to-right',
  color = '#ff4422'
}: AnimatedKartProps) {
  const kartRef = useRef<HTMLDivElement>(null);
  const wheelsRef = useRef<HTMLDivElement[]>([]);
  const exhaustRef = useRef<HTMLDivElement>(null);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const kart = kartRef.current;
    if (!container || !kart) return;

    const ctx = gsap.context(() => {
      // Initial position - off screen
      const startX = direction === 'left-to-right' ? '-120%' : '120%';
      const endX = direction === 'left-to-right' ? '120%' : '-120%';
      
      gsap.set(kart, { 
        x: startX, 
        opacity: 0,
        scale: 0.7,
        rotateY: direction === 'left-to-right' ? 0 : 180
      });

      // Main scroll animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.8,
          onUpdate: (self) => {
            // Acceleration effect based on scroll velocity
            const velocity = Math.abs(self.getVelocity());
            setIsAccelerating(velocity > 200);
            
            // Wheel rotation based on progress
            const rotation = self.progress * 720 * (direction === 'left-to-right' ? 1 : -1);
            wheelsRef.current.forEach(wheel => {
              gsap.to(wheel, {
                rotation,
                duration: 0.1,
                overwrite: 'auto'
              });
            });

            // Vibration effect when moving fast
            if (velocity > 150) {
              gsap.to(kart, {
                y: `+=${Math.sin(Date.now() / 30) * 1.5}`,
                duration: 0.03,
                overwrite: 'auto'
              });
            }
          },
          onEnter: () => {
            // Emit smoke particles
            emitSmoke();
          }
        }
      });

      // Entry animation
      tl.to(kart, {
        x: direction === 'left-to-right' ? '10%' : '-10%',
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: 'power2.out'
      })
      // Cruise through
      .to(kart, {
        x: direction === 'left-to-right' ? '50%' : '-50%',
        duration: 0.4,
        ease: 'none'
      })
      // Exit animation
      .to(kart, {
        x: endX,
        opacity: 0,
        scale: 1.2,
        duration: 0.35,
        ease: 'power2.in'
      });

    });

    return () => ctx.revert();
  }, [containerRef, direction]);

  // Smoke particle emission
  const emitSmoke = () => {
    const container = particleContainerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.cssText = `
        width: ${Math.random() * 20 + 10}px;
        height: ${Math.random() * 20 + 10}px;
        background: radial-gradient(circle, rgba(150,150,150,0.5) 0%, rgba(100,100,100,0.2) 50%, transparent 100%);
        left: ${direction === 'left-to-right' ? '10%' : '90%'};
        bottom: 20%;
      `;
      container.appendChild(particle);

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: -Math.random() * 150 - 50,
        scale: Math.random() * 2 + 1,
        opacity: 0,
        duration: Math.random() * 2 + 1.5,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    };

    // Emit particles periodically
    const interval = setInterval(createParticle, 100);
    setTimeout(() => clearInterval(interval), 3000);
  };

  const isLeftToRight = direction === 'left-to-right';

  return (
    <div 
      ref={kartRef}
      className="absolute top-1/2 -translate-y-1/2 z-30 will-change-transform"
      style={{ 
        width: '180px',
        height: '80px',
        perspective: '500px'
      }}
    >
      {/* Smoke particles container */}
      <div ref={particleContainerRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Kart Body */}
      <div 
        className={`relative w-full h-full ${isAccelerating ? 'kart-accelerating' : 'kart-idle'}`}
        style={{
          filter: isAccelerating ? 'brightness(1.2)' : 'brightness(1)'
        }}
      >
        {/* Main chassis */}
        <div 
          className="absolute bottom-4 left-0 right-0 h-10 rounded-lg"
          style={{ 
            background: `linear-gradient(180deg, ${color} 0%, ${adjustColor(color, -30)} 100%)`,
            boxShadow: isAccelerating 
              ? `0 0 30px ${color}, 0 0 60px ${color}80` 
              : `0 5px 20px rgba(0,0,0,0.3)`,
            clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)'
          }}
        />
        
        {/* Cockpit */}
        <div 
          className="absolute bottom-10 left-1/4 w-16 h-12 rounded-t-lg"
          style={{ 
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
          }}
        />
        
        {/* Driver helmet */}
        <div 
          className="absolute bottom-14 left-8 w-8 h-8 rounded-full"
          style={{ 
            background: 'radial-gradient(circle at 30% 30%, #fff 0%, #ccc 50%, #999 100%)',
            boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)'
          }}
        />
        
        {/* Front wing */}
        <div 
          className="absolute bottom-2 left-0 w-8 h-4 rounded-l"
          style={{ background: color }}
        />
        
        {/* Rear wing */}
        <div 
          className="absolute bottom-8 right-0 w-6 h-12 rounded-r"
          style={{ background: color }}
        />
        
        {/* Side pods */}
        <div 
          className="absolute bottom-4 left-8 w-12 h-6 rounded"
          style={{ 
            background: `linear-gradient(90deg, ${adjustColor(color, -20)} 0%, ${color} 100%)`
          }}
        />
        <div 
          className="absolute bottom-4 right-8 w-12 h-6 rounded"
          style={{ 
            background: `linear-gradient(90deg, ${color} 0%, ${adjustColor(color, -20)} 100%)`
          }}
        />
        
        {/* Number */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-bold text-xl"
          style={{ 
            fontFamily: 'Teko, sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          07
        </div>
        
        {/* Wheels */}
        <div 
          ref={el => { if (el) wheelsRef.current[0] = el; }}
          className="absolute -bottom-2 left-2 w-10 h-10 rounded-full border-4 border-gray-800"
          style={{ 
            background: 'repeating-conic-gradient(from 0deg, #1a1a1a 0deg 30deg, #333 30deg 60deg)'
          }}
        />
        <div 
          ref={el => { if (el) wheelsRef.current[1] = el; }}
          className="absolute -bottom-2 right-2 w-10 h-10 rounded-full border-4 border-gray-800"
          style={{ 
            background: 'repeating-conic-gradient(from 0deg, #1a1a1a 0deg 30deg, #333 30deg 60deg)'
          }}
        />
        
        {/* Speed lines when accelerating */}
        {isAccelerating && (
          <>
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
              style={{ 
                width: '100px',
                left: isLeftToRight ? '-100px' : 'auto',
                right: isLeftToRight ? 'auto' : '-100px',
                animation: 'speed-line 0.3s linear infinite'
              }}
            />
            <div 
              className="absolute top-1/3 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
              style={{ 
                width: '80px',
                left: isLeftToRight ? '-80px' : 'auto',
                right: isLeftToRight ? 'auto' : '-80px',
                animation: 'speed-line 0.4s linear infinite 0.1s'
              }}
            />
          </>
        )}
        
        {/* Exhaust flame */}
        {isAccelerating && (
          <div 
            ref={exhaustRef}
            className="absolute bottom-6 rounded-full"
            style={{ 
              width: '30px',
              height: '12px',
              right: isLeftToRight ? '-20px' : 'auto',
              left: isLeftToRight ? 'auto' : '-20px',
              background: 'linear-gradient(90deg, #ff4422 0%, #ff8844 50%, transparent 100%)',
              filter: 'blur(2px)',
              animation: 'exhaust-flicker 0.1s ease-in-out infinite alternate'
            }}
          />
        )}
      </div>
      
      <style>{`
        @keyframes exhaust-flicker {
          from { transform: scaleX(1) scaleY(1); opacity: 0.8; }
          to { transform: scaleX(1.3) scaleY(0.8); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default AnimatedKart;
