import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoProps {
  containerRef: React.RefObject<HTMLElement | null>;
  frames: string[];
  fps?: number;
  className?: string;
}

/**
 * ScrollVideo - Componente que sincroniza uma sequência de frames
 * com o scroll do usuário, criando um efeito de "video scrubbing"
 * similar ao que o Remotion fazia
 */
export function ScrollVideo({
  containerRef,
  frames,
  fps = 30,
  className = ''
}: ScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImagesRef = useRef(0);
  const progressRef = useRef(0);

  // Preload all frames
  useEffect(() => {
    const loadImages = async () => {
      imagesRef.current = frames.map((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedImagesRef.current++;
        };
        return img;
      });
    };

    loadImages();
  }, [frames]);

  // Draw current frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image with cover fit
    const scale = Math.max(
      canvas.width / img.width,
      canvas.height / img.height
    );
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, []);

  // Scroll-triggered animation
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawFrame(currentFrame);
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    // Create scroll-triggered timeline
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${frames.length * (1000 / fps)}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const frameIndex = Math.min(
            Math.floor(self.progress * frames.length),
            frames.length - 1
          );
          setCurrentFrame(frameIndex);
          drawFrame(frameIndex);
        }
      });
    });

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, [containerRef, frames.length, fps, currentFrame, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ objectFit: 'cover' }}
    />
  );
}

interface AnimatedSequenceProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
  duration?: number;
  ease?: string;
}

/**
 * AnimatedSequence - Componente que anima elementos filhos
 * baseado no progresso do scroll, criando uma sequência cinematográfica
 */
export function AnimatedSequence({
  children,
  containerRef,
  duration = 100,
  ease = 'none'
}: AnimatedSequenceProps) {
  const sequenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence) return;

    const ctx = gsap.context(() => {
      // Pin the container and scrub through the animation
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${duration}%`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          // Update animation progress
          const progress = self.progress;
          
          // Apply easing
          const easedProgress = gsap.parseEase(ease)(progress);
          
          // Dispatch custom event for child components
          const event = new CustomEvent('sequenceProgress', {
            detail: { progress: easedProgress, rawProgress: progress }
          });
          sequence.dispatchEvent(event);
        }
      });
    });

    return () => ctx.revert();
  }, [containerRef, duration, ease]);

  return (
    <div ref={sequenceRef} className="relative w-full h-full">
      {children}
    </div>
  );
}

interface SequenceElementProps {
  children: React.ReactNode;
  start?: number;
  end?: number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  className?: string;
}

/**
 * SequenceElement - Elemento individual dentro de uma sequência animada
 */
export function SequenceElement({
  children,
  start = 0,
  end = 100,
  from = { opacity: 0, y: 100 },
  to = { opacity: 1, y: 0 },
  className = ''
}: SequenceElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleProgress = (e: Event) => {
      const customEvent = e as CustomEvent;
      const progress = customEvent.detail.progress;
      
      // Calculate local progress within this element's timeframe
      const localProgress = gsap.utils.clamp(
        0,
        1,
        (progress - start / 100) / ((end - start) / 100)
      );

      // Interpolate values
      const currentStyle: React.CSSProperties = {};
      
      Object.keys(to).forEach((key) => {
        const fromValue = (from as Record<string, number>)[key] ?? 0;
        const toValue = (to as Record<string, number>)[key] ?? 1;
        const value = gsap.utils.interpolate(fromValue, toValue, localProgress);
        
        if (key === 'opacity') {
          currentStyle.opacity = value;
        } else if (key === 'y') {
          currentStyle.transform = `translateY(${value}px)`;
        } else if (key === 'x') {
          currentStyle.transform = `translateX(${value}px)`;
        } else if (key === 'scale') {
          currentStyle.transform = `scale(${value})`;
        } else if (key === 'rotation') {
          currentStyle.transform = `rotate(${value}deg)`;
        }
      });

      setStyle(currentStyle);
    };

    // Listen for progress events from parent
    const parent = element.parentElement;
    if (parent) {
      parent.addEventListener('sequenceProgress', handleProgress);
    }

    return () => {
      if (parent) {
        parent.removeEventListener('sequenceProgress', handleProgress);
      }
    };
  }, [start, end, from, to]);

  return (
    <div 
      ref={elementRef}
      className={`absolute ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default ScrollVideo;
