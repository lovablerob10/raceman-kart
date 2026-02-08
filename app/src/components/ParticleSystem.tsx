import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  color: { r: number; g: number; b: number };
}

interface ParticleSystemProps {
  containerRef: React.RefObject<HTMLElement | null>;
  type?: 'smoke' | 'sparks' | 'dust' | 'heat';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  emitFrom?: 'bottom' | 'center' | 'custom';
  customPosition?: { x: number; y: number };
}

export function ParticleSystem({
  containerRef,
  type = 'smoke',
  intensity = 'medium',
  color = '#ffffff',
  emitFrom = 'bottom',
  customPosition
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);

  const intensityConfig = {
    low: { spawnRate: 0.3, maxParticles: 50, sizeMultiplier: 0.8 },
    medium: { spawnRate: 0.6, maxParticles: 100, sizeMultiplier: 1 },
    high: { spawnRate: 1, maxParticles: 200, sizeMultiplier: 1.3 }
  };

  const parseColor = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const createParticle = useCallback((canvasWidth: number, canvasHeight: number): Particle => {
    const config = intensityConfig[intensity];
    const baseColor = parseColor(color);
    
    let x: number, y: number, vx: number, vy: number, size: number, life: number;

    switch (emitFrom) {
      case 'bottom':
        x = Math.random() * canvasWidth;
        y = canvasHeight + 20;
        vx = (Math.random() - 0.5) * 2;
        vy = -Math.random() * 3 - 1;
        break;
      case 'center':
        x = canvasWidth / 2 + (Math.random() - 0.5) * 100;
        y = canvasHeight / 2 + (Math.random() - 0.5) * 100;
        vx = (Math.random() - 0.5) * 4;
        vy = (Math.random() - 0.5) * 4;
        break;
      case 'custom':
        x = (customPosition?.x ?? 0.5) * canvasWidth;
        y = (customPosition?.y ?? 0.5) * canvasHeight;
        vx = (Math.random() - 0.5) * 3;
        vy = (Math.random() - 0.5) * 3;
        break;
      default:
        x = Math.random() * canvasWidth;
        y = canvasHeight;
        vx = (Math.random() - 0.5) * 2;
        vy = -Math.random() * 2;
    }

    switch (type) {
      case 'smoke':
        size = (Math.random() * 30 + 20) * config.sizeMultiplier;
        life = Math.random() * 120 + 80;
        vy *= 0.8;
        break;
      case 'sparks':
        size = (Math.random() * 4 + 2) * config.sizeMultiplier;
        life = Math.random() * 30 + 20;
        vx *= 3;
        vy *= 3;
        break;
      case 'dust':
        size = (Math.random() * 8 + 4) * config.sizeMultiplier;
        life = Math.random() * 60 + 40;
        break;
      case 'heat':
        size = (Math.random() * 50 + 30) * config.sizeMultiplier;
        life = Math.random() * 40 + 30;
        vx *= 0.5;
        vy = -Math.abs(vy) * 2;
        break;
      default:
        size = 20;
        life = 100;
    }

    return {
      x,
      y,
      vx,
      vy,
      life,
      maxLife: life,
      size,
      opacity: 1,
      color: baseColor
    };
  }, [intensity, color, emitFrom, customPosition, type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    // Scroll trigger for activation
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter: () => { isActiveRef.current = true; },
      onLeave: () => { isActiveRef.current = false; },
      onEnterBack: () => { isActiveRef.current = true; },
      onLeaveBack: () => { isActiveRef.current = false; }
    });

    // Animation loop
    let frameCount = 0;
    const config = intensityConfig[intensity];

    const animate = () => {
      frameCount++;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear with fade for trail effect
      ctx.fillStyle = type === 'sparks' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Spawn new particles
      if (isActiveRef.current && frameCount % Math.floor(10 / config.spawnRate) === 0) {
        if (particlesRef.current.length < config.maxParticles) {
          particlesRef.current.push(createParticle(width, height));
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        // Physics update
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Type-specific physics
        switch (type) {
          case 'smoke':
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy *= 0.995;
            particle.size *= 1.005;
            break;
          case 'sparks':
            particle.vy += 0.15; // Gravity
            particle.vx *= 0.98;
            break;
          case 'heat':
            particle.size *= 1.02;
            particle.vx *= 0.99;
            break;
        }

        // Calculate opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = lifeRatio * (type === 'heat' ? 0.3 : 0.8);

        // Draw particle
        if (particle.life > 0 && particle.opacity > 0) {
          ctx.save();
          
          switch (type) {
            case 'smoke':
              // Volumetric smoke with gradient
              const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
              );
              const { r, g, b } = particle.color;
              gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.5})`);
              gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.2})`);
              gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
              
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
              break;

            case 'sparks':
              // Glowing sparks
              ctx.shadowBlur = 10;
              ctx.shadowColor = `rgb(${particle.color.r}, ${particle.color.g}, ${particle.color.b})`;
              ctx.fillStyle = `rgba(255, 200, 100, ${particle.opacity})`;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
              
              // Spark trail
              ctx.strokeStyle = `rgba(255, 150, 50, ${particle.opacity * 0.5})`;
              ctx.lineWidth = particle.size * 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3);
              ctx.stroke();
              break;

            case 'heat':
              // Heat haze distortion
              ctx.filter = 'blur(8px)';
              const heatGradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
              );
              heatGradient.addColorStop(0, `rgba(255, 100, 50, ${particle.opacity * 0.3})`);
              heatGradient.addColorStop(0.5, `rgba(255, 150, 100, ${particle.opacity * 0.1})`);
              heatGradient.addColorStop(1, 'rgba(255, 200, 150, 0)');
              
              ctx.fillStyle = heatGradient;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.filter = 'none';
              break;

            case 'dust':
              ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity * 0.4})`;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
              break;
          }
          
          ctx.restore();
          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      scrollTrigger.kill();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerRef, type, intensity, color, emitFrom, customPosition, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ 
        mixBlendMode: type === 'heat' ? 'screen' : 'normal',
        opacity: type === 'heat' ? 0.6 : 1
      }}
    />
  );
}

export default ParticleSystem;
