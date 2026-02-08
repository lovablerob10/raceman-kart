import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation<T extends HTMLElement>(
  animationCallback: (element: T, gsapInstance: typeof gsap) => gsap.core.Timeline | gsap.core.Tween | void
) {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const result = animationCallback(element, gsap);
      if (result) {
        animationRef.current = result;
      }
    }, element);

    return () => {
      ctx.revert();
    };
  }, [animationCallback]);

  return elementRef;
}

export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return elementRef;
}

export function useFadeInUp<T extends HTMLElement>(
  delay: number = 0,
  duration: number = 0.8
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element, { opacity: 0, y: 60 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [delay, duration]);

  return elementRef;
}

export function useFadeInLeft<T extends HTMLElement>(
  delay: number = 0,
  duration: number = 0.8
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element, { opacity: 0, x: -100 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            x: 0,
            duration,
            delay,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [delay, duration]);

  return elementRef;
}

export function useFadeInRight<T extends HTMLElement>(
  delay: number = 0,
  duration: number = 0.8
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element, { opacity: 0, x: 100 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            x: 0,
            duration,
            delay,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [delay, duration]);

  return elementRef;
}

export function useScaleIn<T extends HTMLElement>(
  delay: number = 0,
  duration: number = 0.6
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element, { opacity: 0, scale: 0.8 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            scale: 1,
            duration,
            delay,
            ease: 'back.out(1.7)',
          });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [delay, duration]);

  return elementRef;
}

export function useStaggerAnimation<T extends HTMLElement>(
  childSelector: string,
  staggerDelay: number = 0.1,
  duration: number = 0.6
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (children.length === 0) return;

    gsap.set(children, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration,
            stagger: staggerDelay,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [childSelector, staggerDelay, duration]);

  return containerRef;
}

export function useKartScrollAnimation(containerRef: React.RefObject<HTMLElement | null>) {
  const kartRef = useRef<HTMLDivElement>(null);
  const smokeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const kart = kartRef.current;
    if (!container || !kart) return;

    const ctx = gsap.context(() => {
      // Initial position
      gsap.set(kart, { 
        x: '-100%', 
        opacity: 0,
        scale: 0.8
      });

      // Main scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            // Add vibration effect based on scroll velocity
            const velocity = Math.abs(self.getVelocity());
            if (velocity > 100) {
              gsap.to(kart, {
                y: Math.sin(Date.now() / 50) * 2,
                duration: 0.05,
                overwrite: 'auto'
              });
            }
          }
        }
      });

      tl.to(kart, {
        x: '20%',
        opacity: 1,
        scale: 1,
        ease: 'none',
        duration: 0.3
      })
      .to(kart, {
        x: '120%',
        opacity: 0,
        scale: 1.1,
        ease: 'power2.in',
        duration: 0.7
      });
    });

    return () => {
      ctx.revert();
      if (smokeIntervalRef.current) {
        clearInterval(smokeIntervalRef.current);
      }
    };
  }, [containerRef]);

  return kartRef;
}

export function useParallaxLayers() {
  const layer1Ref = useRef<HTMLDivElement>(null); // Slow - background
  const layer2Ref = useRef<HTMLDivElement>(null); // Medium - midground
  const layer3Ref = useRef<HTMLDivElement>(null); // Fast - foreground

  useEffect(() => {
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    const layer3 = layer3Ref.current;

    const ctx = gsap.context(() => {
      // Background layer - slowest
      if (layer1) {
        gsap.to(layer1, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: layer1.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Midground layer - medium speed
      if (layer2) {
        gsap.to(layer2, {
          yPercent: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: layer2.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Foreground layer - fastest
      if (layer3) {
        gsap.to(layer3, {
          yPercent: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: layer3.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return { layer1Ref, layer2Ref, layer3Ref };
}

export default useScrollAnimation;
