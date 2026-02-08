import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'scale-up' 
  | 'scale-down'
  | 'rotate-in'
  | 'flip-x'
  | 'flip-y'
  | 'bounce-in';

interface RevealOptions {
  type?: AnimationType;
  duration?: number;
  delay?: number;
  ease?: string;
  distance?: number;
  scale?: number;
  rotate?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
}

const defaultOptions: Required<RevealOptions> = {
  type: 'fade-up',
  duration: 0.8,
  delay: 0,
  ease: 'power3.out',
  distance: 60,
  scale: 0.9,
  rotate: 10,
  stagger: 0.1,
  start: 'top 85%',
  once: true,
};

const getInitialState = (type: AnimationType, options: typeof defaultOptions) => {
  switch (type) {
    case 'fade-up':
      return { opacity: 0, y: options.distance };
    case 'fade-down':
      return { opacity: 0, y: -options.distance };
    case 'fade-left':
      return { opacity: 0, x: -options.distance };
    case 'fade-right':
      return { opacity: 0, x: options.distance };
    case 'scale-up':
      return { opacity: 0, scale: options.scale };
    case 'scale-down':
      return { opacity: 0, scale: 1.2 };
    case 'rotate-in':
      return { opacity: 0, rotation: -options.rotate, scale: options.scale };
    case 'flip-x':
      return { opacity: 0, rotationX: 90 };
    case 'flip-y':
      return { opacity: 0, rotationY: 90 };
    case 'bounce-in':
      return { opacity: 0, scale: 0, y: options.distance };
    default:
      return { opacity: 0, y: options.distance };
  }
};

const getFinalState = (type: AnimationType) => {
  switch (type) {
    case 'fade-up':
    case 'fade-down':
      return { opacity: 1, y: 0 };
    case 'fade-left':
    case 'fade-right':
      return { opacity: 1, x: 0 };
    case 'scale-up':
    case 'scale-down':
      return { opacity: 1, scale: 1 };
    case 'rotate-in':
      return { opacity: 1, rotation: 0, scale: 1 };
    case 'flip-x':
      return { opacity: 1, rotationX: 0 };
    case 'flip-y':
      return { opacity: 1, rotationY: 0 };
    case 'bounce-in':
      return { opacity: 1, scale: 1, y: 0 };
    default:
      return { opacity: 1, y: 0 };
  }
};

export function useRevealAnimation<T extends HTMLElement>(options: RevealOptions = {}) {
  const elementRef = useRef<T>(null);
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const initialState = getInitialState(mergedOptions.type, mergedOptions);
    const finalState = getFinalState(mergedOptions.type);

    gsap.set(element, initialState);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: mergedOptions.start,
        onEnter: () => {
          gsap.to(element, {
            ...finalState,
            duration: mergedOptions.duration,
            delay: mergedOptions.delay,
            ease: mergedOptions.ease,
          });
        },
        once: mergedOptions.once,
      });
    });

    return () => ctx.revert();
  }, [mergedOptions]);

  return elementRef;
}

// Hook for staggered children animations
export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  options: RevealOptions = {}
) {
  const containerRef = useRef<T>(null);
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (children.length === 0) return;

    const initialState = getInitialState(mergedOptions.type, mergedOptions);
    const finalState = getFinalState(mergedOptions.type);

    gsap.set(children, initialState);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: mergedOptions.start,
        onEnter: () => {
          gsap.to(children, {
            ...finalState,
            duration: mergedOptions.duration,
            delay: mergedOptions.delay,
            stagger: mergedOptions.stagger,
            ease: mergedOptions.ease,
          });
        },
        once: mergedOptions.once,
      });
    });

    return () => ctx.revert();
  }, [childSelector, mergedOptions]);

  return containerRef;
}

// Hook for sequential section reveals
export function useSequentialReveal(sectionsSelector: string, options: RevealOptions = {}) {
  const triggeredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const sections = document.querySelectorAll(sectionsSelector);
    if (sections.length === 0) return;

    const mergedOptions = { ...defaultOptions, ...options };
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, index) => {
      const initialState = getInitialState(mergedOptions.type, mergedOptions);
      gsap.set(section, initialState);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: mergedOptions.start,
        onEnter: () => {
          const id = section.id || `section-${index}`;
          if (triggeredRef.current.has(id)) return;
          triggeredRef.current.add(id);

          const finalState = getFinalState(mergedOptions.type);
          gsap.to(section, {
            ...finalState,
            duration: mergedOptions.duration,
            delay: mergedOptions.delay + index * mergedOptions.stagger,
            ease: mergedOptions.ease,
          });
        },
        once: mergedOptions.once,
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [sectionsSelector, options]);
}

// Hook for counter animation
export function useCounterAnimation(
  endValue: number,
  duration: number = 2,
  suffix: string = ''
) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        onEnter: () => {
          if (hasAnimatedRef.current) return;
          hasAnimatedRef.current = true;

          const obj = { value: 0 };
          gsap.to(obj, {
            value: endValue,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              element.textContent = Math.round(obj.value) + suffix;
            },
          });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [endValue, duration, suffix]);

  return elementRef;
}

// Hook for text reveal (character by character)
export function useTextReveal<T extends HTMLElement>(options: { delay?: number; stagger?: number } = {}) {
  const elementRef = useRef<T>(null);
  const { delay = 0, stagger = 0.03 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const text = element.textContent || '';
    element.innerHTML = text
      .split('')
      .map(char => `<span class="inline-block opacity-0">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const chars = element.querySelectorAll('span');

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.5,
            stagger,
            delay,
            ease: 'back.out(1.7)',
            from: { y: 20, rotation: -5 }
          });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [delay, stagger]);

  return elementRef;
}

export default useRevealAnimation;
