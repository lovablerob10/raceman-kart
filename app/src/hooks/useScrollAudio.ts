import { useEffect, useRef, useCallback } from 'react';

/**
 * useScrollAudio - Hook to sync real audio file with scroll progress
 * 
 * @param progress - Scroll progress from 0 to 1 (same as video progress)
 * @param audioSrc - Path to audio file (default: /audio/engine-sound.mp4)
 */
export function useScrollAudio(progress: number, audioSrc: string = '/audio/engine-sound.mp4') {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isInitializedRef = useRef(false);
    const lastProgressRef = useRef(0);

    // Initialize audio on user interaction
    const initAudio = useCallback(() => {
        if (!isInitializedRef.current) {
            const audio = new Audio(audioSrc);
            audio.preload = 'auto';
            audio.loop = false;
            audio.volume = 0.5;

            // Preload the audio
            audio.load();

            audioRef.current = audio;
            isInitializedRef.current = true;

            // Remove listeners after init
            window.removeEventListener('scroll', initAudio);
            window.removeEventListener('click', initAudio);
            window.removeEventListener('touchstart', initAudio);
        }
    }, [audioSrc]);

    // Setup initialization listeners
    useEffect(() => {
        window.addEventListener('scroll', initAudio);
        window.addEventListener('click', initAudio);
        window.addEventListener('touchstart', initAudio);

        return () => {
            window.removeEventListener('scroll', initAudio);
            window.removeEventListener('click', initAudio);
            window.removeEventListener('touchstart', initAudio);

            // Cleanup audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [initAudio]);

    // Sync audio time with progress
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !isInitializedRef.current) return;

        // Calculate target time based on progress
        const duration = audio.duration;
        if (!isFinite(duration) || duration === 0) return;

        const safeProgress = Math.max(0, Math.min(1, progress));
        const targetTime = safeProgress * duration;

        // Check if we're scrolling (progress is changing)
        const isScrolling = Math.abs(progress - lastProgressRef.current) > 0.001;
        lastProgressRef.current = progress;

        if (isScrolling && safeProgress > 0 && safeProgress < 1) {
            // Sync audio time
            if (Math.abs(audio.currentTime - targetTime) > 0.5) {
                audio.currentTime = targetTime;
            }

            // Play if paused
            if (audio.paused) {
                audio.play().catch(() => {
                    // Autoplay blocked - ignore
                });
            }
        } else {
            // Not scrolling - pause audio
            if (!audio.paused) {
                audio.pause();
            }
        }
    }, [progress]);

    // Volume control based on scroll speed
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Calculate scroll speed from progress delta
        const progressDelta = Math.abs(progress - lastProgressRef.current);
        const normalizedSpeed = Math.min(1, progressDelta * 20);

        // Adjust volume based on speed (faster scroll = louder)
        audio.volume = 0.3 + (normalizedSpeed * 0.5);
    }, [progress]);
}

/**
 * Alternative: Simple engine sound hook using oscillator (no audio file needed)
 */
export function useScrollEngineSound(speed: number) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const isInitializedRef = useRef(false);

    // Initialize Audio Context on user interaction
    useEffect(() => {
        const handleInit = () => {
            if (!isInitializedRef.current) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    audioContextRef.current = new AudioContext();
                    isInitializedRef.current = true;

                    const ctx = audioContextRef.current;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(100, ctx.currentTime);
                    gain.gain.setValueAtTime(0, ctx.currentTime);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();

                    oscillatorRef.current = osc;
                    gainNodeRef.current = gain;
                }
                window.removeEventListener('scroll', handleInit);
                window.removeEventListener('click', handleInit);
            }
        };

        window.addEventListener('scroll', handleInit);
        window.addEventListener('click', handleInit);

        return () => {
            window.removeEventListener('scroll', handleInit);
            window.removeEventListener('click', handleInit);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Modulate sound based on speed
    useEffect(() => {
        if (!audioContextRef.current || !oscillatorRef.current || !gainNodeRef.current) return;

        const ctx = audioContextRef.current;
        const osc = oscillatorRef.current;
        const gain = gainNodeRef.current;

        const targetFreq = 100 + (speed * 2);
        const targetGain = speed > 5 ? Math.min(0.2, speed / 500) : 0;

        osc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);
        gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.1);
    }, [speed]);
}
