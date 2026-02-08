import { useEffect, useRef, useState, useCallback } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { KartRacing } from '../remotion/KartRacing';

interface ScrollVideoPlayerProps {
    driverName?: string;
    speed?: number;
    ranking?: number;
    lapTime?: string;
    teamColor?: string;
    className?: string;
    onProgressChange?: (progress: number) => void;
}

/**
 * ScrollVideoPlayer - Player Remotion sincronizado com scroll
 * Usa RAF para performance a 60fps
 */
export function ScrollVideoPlayer({
    driverName = 'PILOTO #01',
    speed = 180,
    ranking = 1,
    lapTime = '1:23.456',
    teamColor = '#E10600',
    className = '',
    onProgressChange,
}: ScrollVideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<PlayerRef>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(0);

    const rafRef = useRef<number | null>(null);
    const lastProgressRef = useRef(0);

    // Intersection Observer for visibility
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // Calculate scroll progress relative to parent section
    const updateProgress = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        // Find the parent section with data-real-kart attribute
        const section = container.closest('[data-real-kart]');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionHeight = section.scrollHeight;
        const viewportHeight = window.innerHeight;

        // Progress from 0 to 1 based on how much we've scrolled through section
        const scrolled = -rect.top;
        const totalScroll = sectionHeight - viewportHeight;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        // Only update if changed significantly
        if (Math.abs(progress - lastProgressRef.current) > 0.001) {
            lastProgressRef.current = progress;
            setScrollProgress(progress);
            onProgressChange?.(progress);

            // Calculate speed based on progress curve
            const speedMultiplier = 1 - Math.abs(progress - 0.5) * 2;
            setCurrentSpeed(Math.round(speedMultiplier * speed));

            // Seek to frame in Remotion player
            if (playerRef.current) {
                const totalFrames = 600; // 10s at 60fps
                const frame = Math.floor(progress * totalFrames);
                playerRef.current.seekTo(frame);
            }
        }

        rafRef.current = requestAnimationFrame(updateProgress);
    }, [speed, onProgressChange]);

    // Start/stop scroll listener based on visibility
    useEffect(() => {
        if (isVisible) {
            rafRef.current = requestAnimationFrame(updateProgress);
        } else if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isVisible, updateProgress]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${className}`}
        >
            <Player
                ref={playerRef}
                component={KartRacing}
                durationInFrames={600}
                fps={60}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
                inputProps={{
                    driverName,
                    speed: currentSpeed,
                    ranking,
                    lapTime,
                    teamColor,
                }}
                controls={false}
                autoPlay={false}
                loop={false}
                renderLoading={() => (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: '#1a0505',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff0000',
                        fontSize: 24,
                    }}>
                        Carregando...
                    </div>
                )}
            />

            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
                <div
                    className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 transition-all duration-75"
                    style={{ width: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* Debug overlay */}
            {import.meta.env.DEV && (
                <div className="absolute top-4 left-4 bg-black/80 text-white text-xs font-mono p-2 rounded z-20">
                    <div>Visible: {isVisible ? 'YES' : 'NO'}</div>
                    <div>Progress: {(scrollProgress * 100).toFixed(1)}%</div>
                    <div>Speed: {currentSpeed} km/h</div>
                </div>
            )}
        </div>
    );
}

export default ScrollVideoPlayer;
