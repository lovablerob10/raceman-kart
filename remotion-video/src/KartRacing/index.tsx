import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from 'remotion';
import { theme } from '../theme';

interface KartRacingProps {
    driverName?: string;
    speed?: number;
    ranking?: number;
    lapTime?: string;
    teamColor?: string;
}

// Particle system for smoke and sparks
const Particles: React.FC<{ intensity: number }> = ({ intensity }) => {
    const frame = useCurrentFrame();
    const particles = Array.from({ length: Math.floor(intensity * 30) }, (_, i) => ({
        id: i,
        x: (frame * 3 + i * 50) % 1920,
        y: 800 + Math.sin(frame * 0.1 + i) * 100,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
        speed: 5 + Math.random() * 10,
    }));

    return (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
            {/* Speed lines */}
            {particles.slice(0, 20).map((p) => (
                <div
                    key={`line-${p.id}`}
                    style={{
                        position: 'absolute',
                        left: 1920 - ((frame * p.speed * 2 + p.x) % 2200),
                        top: p.y - 400,
                        width: 100 + intensity * 200,
                        height: 2,
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,${p.opacity * intensity}))`,
                        borderRadius: 1,
                    }}
                />
            ))}

            {/* Sparks */}
            {intensity > 0.5 && particles.slice(20).map((p) => (
                <div
                    key={`spark-${p.id}`}
                    style={{
                        position: 'absolute',
                        left: 1920 - ((frame * p.speed * 3 + p.x) % 2000),
                        top: p.y - 200 + Math.sin(frame * 0.3 + p.id) * 50,
                        width: p.size,
                        height: p.size,
                        background: `radial-gradient(circle, ${theme.colors.accent}, ${theme.colors.primary})`,
                        borderRadius: '50%',
                        boxShadow: `0 0 ${p.size * 2}px ${theme.colors.accent}`,
                        opacity: p.opacity * intensity,
                    }}
                />
            ))}

            {/* Tire smoke */}
            {intensity > 0.3 && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        left: 300,
                        width: 400,
                        height: 200,
                        background: `radial-gradient(ellipse, rgba(128,128,128,${intensity * 0.3}), transparent)`,
                        filter: `blur(${20 + intensity * 30}px)`,
                        transform: `translateX(${-frame * 2}px) scale(${1 + intensity * 0.5})`,
                    }}
                />
            )}
        </AbsoluteFill>
    );
};

// HUD Telemetry Component
const HUD: React.FC<{
    driverName?: string;
    speed: number;
    ranking?: number;
    lapTime?: string;
    teamColor?: string;
    scrollProgress: number;
}> = ({
    driverName = 'PILOTO',
    speed,
    ranking = 1,
    lapTime = '0:00.000',
    teamColor = theme.colors.primary,
    scrollProgress,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();

        // Animated RPM based on scroll progress
        const rpm = interpolate(scrollProgress, [0, 1], [1000, 15000]);
        const rpmAngle = interpolate(rpm, [0, 15000], [-135, 135]);

        // Gear based on RPM
        const gear = rpm < 3000 ? 1 : rpm < 5000 ? 2 : rpm < 7000 ? 3 : rpm < 10000 ? 4 : rpm < 13000 ? 5 : 6;

        // Entry animation
        const slideIn = spring({
            frame,
            fps,
            config: { damping: 15, stiffness: 100 },
        });

        return (
            <AbsoluteFill>
                {/* Top bar */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 40px',
                        transform: `translateY(${interpolate(slideIn, [0, 1], [-60, 0])}px)`,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div
                            style={{
                                width: 8,
                                height: 40,
                                background: teamColor,
                                borderRadius: 2,
                            }}
                        />
                        <span
                            style={{
                                fontFamily: theme.fonts.display,
                                fontSize: 32,
                                color: 'white',
                                letterSpacing: 2,
                            }}
                        >
                            {driverName}
                        </span>
                    </div>
                    <div
                        style={{
                            fontFamily: theme.fonts.technical,
                            fontSize: 24,
                            color: theme.colors.accent,
                        }}
                    >
                        P{ranking} • {lapTime}
                    </div>
                </div>

                {/* RPM Gauge - Bottom Left */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        left: 40,
                        transform: `translateX(${interpolate(slideIn, [0, 1], [-200, 0])}px)`,
                    }}
                >
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        {/* Background arc */}
                        <path
                            d="M 30 170 A 85 85 0 1 1 170 170"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            strokeLinecap="round"
                        />
                        {/* RPM arc */}
                        <path
                            d="M 30 170 A 85 85 0 1 1 170 170"
                            fill="none"
                            stroke={rpm > 12000 ? theme.colors.primary : 'white'}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(rpm / 15000) * 267} 267`}
                            style={{
                                filter: rpm > 12000 ? `drop-shadow(0 0 10px ${theme.colors.primary})` : 'none',
                            }}
                        />
                        {/* Needle */}
                        <line
                            x1="100"
                            y1="100"
                            x2={100 + Math.cos((rpmAngle - 90) * Math.PI / 180) * 60}
                            y2={100 + Math.sin((rpmAngle - 90) * Math.PI / 180) * 60}
                            stroke={theme.colors.primary}
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <circle cx="100" cy="100" r="8" fill={theme.colors.primary} />
                        {/* RPM value */}
                        <text
                            x="100"
                            y="150"
                            textAnchor="middle"
                            fill="white"
                            fontFamily={theme.fonts.technical}
                            fontSize="24"
                        >
                            {Math.round(rpm)}
                        </text>
                        <text
                            x="100"
                            y="170"
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.5)"
                            fontFamily={theme.fonts.technical}
                            fontSize="12"
                        >
                            RPM
                        </text>
                    </svg>
                </div>

                {/* Speed - Bottom Center */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        left: '50%',
                        transform: `translateX(-50%) translateY(${interpolate(slideIn, [0, 1], [100, 0])}px)`,
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontFamily: theme.fonts.display,
                            fontSize: 120,
                            fontWeight: 'bold',
                            color: speed > 150 ? theme.colors.primary : 'white',
                            textShadow: speed > 150 ? `0 0 30px ${theme.colors.primary}` : 'none',
                            lineHeight: 1,
                        }}
                    >
                        {Math.round(speed)}
                    </div>
                    <div
                        style={{
                            fontFamily: theme.fonts.technical,
                            fontSize: 24,
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: 4,
                        }}
                    >
                        KM/H
                    </div>
                </div>

                {/* Gear - Bottom Right */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        right: 40,
                        transform: `translateX(${interpolate(slideIn, [0, 1], [200, 0])}px)`,
                        textAlign: 'center',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '20px 40px',
                        borderRadius: 8,
                        border: `2px solid ${gear === 6 ? theme.colors.primary : 'rgba(255,255,255,0.2)'}`,
                    }}
                >
                    <div
                        style={{
                            fontFamily: theme.fonts.technical,
                            fontSize: 14,
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: 2,
                        }}
                    >
                        GEAR
                    </div>
                    <div
                        style={{
                            fontFamily: theme.fonts.display,
                            fontSize: 80,
                            fontWeight: 'bold',
                            color: gear === 6 ? theme.colors.primary : 'white',
                            lineHeight: 1,
                        }}
                    >
                        {gear}
                    </div>
                </div>
            </AbsoluteFill>
        );
    };

// Post-processing effects
const PostProcessing: React.FC<{ intensity: number }> = ({ intensity }) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {/* Vignette */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse at center, transparent ${60 - intensity * 20}%, rgba(0,0,0,${0.3 + intensity * 0.4}) 100%)`,
                }}
            />

            {/* Film grain */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.05 + intensity * 0.05,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    transform: `translate(${frame % 10}px, ${frame % 10}px)`,
                }}
            />

            {/* Chromatic aberration at high speed */}
            {intensity > 0.7 && (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255,0,0,0.03)',
                            transform: `translateX(${intensity * 3}px)`,
                            mixBlendMode: 'screen',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,255,255,0.03)',
                            transform: `translateX(${-intensity * 3}px)`,
                            mixBlendMode: 'screen',
                        }}
                    />
                </>
            )}

            {/* Color grading overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,100,0,0.05), transparent, rgba(0,50,100,0.05))',
                    mixBlendMode: 'overlay',
                }}
            />
        </AbsoluteFill>
    );
};

// Track background with parallax
const Track: React.FC<{ progress: number }> = ({ progress }) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ background: '#111' }}>
            {/* Parallax layers */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, 
            #0a0a0a 0%, 
            #1a1a1a 40%, 
            #2a2a2a 60%, 
            #1a1a1a 80%, 
            #0a0a0a 100%
          )`,
                }}
            />

            {/* Asphalt texture moving */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: '#222',
                    transform: `translateX(${-frame * 10 * (0.5 + progress)}px)`,
                }}
            >
                {/* Road markings */}
                {Array.from({ length: 30 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: (i * 200 + frame * 10 * (0.5 + progress)) % 3000 - 200,
                            top: '45%',
                            width: 80,
                            height: 8,
                            background: 'white',
                            borderRadius: 2,
                        }}
                    />
                ))}
            </div>

            {/* Horizon glow */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '35%',
                    left: 0,
                    right: 0,
                    height: 100,
                    background: `linear-gradient(180deg, transparent, rgba(${theme.colors.primary.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(',')}, 0.1))`,
                    filter: 'blur(30px)',
                }}
            />
        </AbsoluteFill>
    );
};

// Main composition
export const KartRacing: React.FC<KartRacingProps> = ({
    driverName = 'PILOTO #01',
    speed = 180,
    ranking = 1,
    lapTime = '1:23.456',
    teamColor = '#E10600',
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Progress based on current frame
    const progress = frame / durationInFrames;

    // Speed curve (faster in middle)
    const speedMultiplier = 1 - Math.abs(progress - 0.5) * 2;
    const currentSpeed = interpolate(
        speedMultiplier,
        [0, 1],
        [speed * 0.3, speed]
    );

    return (
        <AbsoluteFill>
            {/* Track background */}
            <Track progress={progress} />

            {/* Particles (smoke, sparks, speed lines) */}
            <Particles intensity={speedMultiplier} />

            {/* HUD overlay */}
            <HUD
                driverName={driverName}
                speed={currentSpeed}
                ranking={ranking}
                lapTime={lapTime}
                teamColor={teamColor}
                scrollProgress={progress}
            />

            {/* Post-processing effects */}
            <PostProcessing intensity={speedMultiplier} />
        </AbsoluteFill>
    );
};

export default KartRacing;
