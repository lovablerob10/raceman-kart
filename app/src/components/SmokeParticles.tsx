import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface SmokeParticlesProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isActive?: boolean;
  particleCount?: number;
  emitFrom?: 'left' | 'right' | 'center';
}

export function SmokeParticles({ 
  containerRef, 
  isActive = true, 
  particleCount = 30,
  emitFrom = 'left' 
}: SmokeParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const scrollProgressRef = useRef(0);

  const createParticle = useCallback((x: number, y: number): Particle | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const size = Math.random() * 30 + 15;
    const angle = (Math.random() - 0.5) * Math.PI;
    const speed = Math.random() * 2 + 1;
    
    return {
      element: document.createElement('div'),
      x,
      y,
      vx: Math.cos(angle) * speed + (emitFrom === 'left' ? 2 : emitFrom === 'right' ? -2 : 0),
      vy: -Math.random() * 3 - 1,
      life: 1,
      maxLife: Math.random() * 60 + 60,
      size
    };
  }, [emitFrom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles on scroll
    const triggers: ScrollTrigger[] = [];
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        
        // Emit particles based on scroll velocity
        if (isActive && self.getVelocity() > 50) {
          const emitX = emitFrom === 'left' ? 50 : emitFrom === 'right' ? canvas.width - 50 : canvas.width / 2;
          const emitY = canvas.height - 30;
          
          for (let i = 0; i < 3; i++) {
            if (particlesRef.current.length < particleCount) {
              const particle = createParticle(emitX + (Math.random() - 0.5) * 40, emitY);
              if (particle) {
                particlesRef.current.push(particle);
              }
            }
          }
        }
      }
    });
    triggers.push(scrollTrigger);

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      frameCount++;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.995;
        particle.life -= 1 / particle.maxLife;
        
        // Draw particle
        if (particle.life > 0) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * particle.life
          );
          gradient.addColorStop(0, `rgba(150, 150, 150, ${particle.life * 0.4})`);
          gradient.addColorStop(0.5, `rgba(100, 100, 100, ${particle.life * 0.2})`);
          gradient.addColorStop(1, 'rgba(80, 80, 80, 0)');
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          return true;
        }
        return false;
      });
      
      // Auto-emit particles periodically
      if (isActive && frameCount % 10 === 0 && particlesRef.current.length < particleCount / 2) {
        const emitX = emitFrom === 'left' ? 80 : emitFrom === 'right' ? canvas.width - 80 : canvas.width / 2;
        const emitY = canvas.height - 50;
        const newParticle = createParticle(emitX, emitY);
        if (newParticle) {
          particlesRef.current.push(newParticle);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      triggers.forEach(t => t.kill());
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerRef, isActive, particleCount, emitFrom, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export default SmokeParticles;
