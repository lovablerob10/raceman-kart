// KartRacing - ABSOLUTE POSITIONING ONLY (no flex)
// Using inset and fixed pixel/percentage values

import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
} from 'remotion';

interface KartRacingProps {
    driverName?: string;
    speed?: number;
    ranking?: number;
    lapTime?: string;
    teamColor?: string;
}

export const KartRacing: React.FC<KartRacingProps> = ({
    speed = 180,
    ranking = 1,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames, width, height } = useVideoConfig();

    const progress = frame / durationInFrames;
    const speedMultiplier = Math.max(0.3, 1 - Math.abs(progress - 0.5) * 1.5);
    const currentSpeed = interpolate(speedMultiplier, [0, 1], [speed * 0.2, speed]);
    const stripeOffset = (frame * 12) % 150;

    const rpm = interpolate(currentSpeed, [0, 200], [1000, 9500]);
    const gear = currentSpeed < 40 ? '1' : currentSpeed < 80 ? '2' : currentSpeed < 120 ? '3' : currentSpeed < 160 ? '4' : '5';

    // Use actual composition dimensions
    const topCurbHeight = 30;
    const bottomCurbHeight = 30;
    const trackTop = topCurbHeight;
    const trackBottom = bottomCurbHeight;

    return (
        <AbsoluteFill>
            {/* Base background - full area */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                    background: 'linear-gradient(180deg, #2a1010 0%, #3a1818 30%, #4a2020 50%, #3a1818 70%, #2a1010 100%)',
                }}
            />

            {/* TOP CURBS */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: -150,
                    width: width + 300,
                    height: topCurbHeight,
                    background: `repeating-linear-gradient(90deg, 
                        #ff0000 0px, #ff0000 40px, 
                        #ffffff 40px, #ffffff 80px)`,
                    transform: `translateX(-${stripeOffset}px)`,
                }}
            />

            {/* TRACK SURFACE - explicit positioning */}
            <div
                style={{
                    position: 'absolute',
                    top: trackTop,
                    left: 0,
                    width: width,
                    height: height - trackTop - trackBottom,
                    background: 'linear-gradient(180deg, #333 0%, #444 20%, #555 50%, #444 80%, #333 100%)',
                }}
            >
                {/* Lane markers */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: 0,
                    width: '100%',
                    height: 3,
                    background: 'rgba(255,255,255,0.5)',
                }} />

                <div style={{
                    position: 'absolute',
                    top: '80%',
                    left: 0,
                    width: '100%',
                    height: 3,
                    background: 'rgba(255,255,255,0.5)',
                }} />

                {/* CENTER YELLOW DASHED LINE */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: -150,
                    width: width + 300,
                    height: 10,
                    marginTop: -5,
                    background: `repeating-linear-gradient(90deg, 
                        #F5B500 0px, #F5B500 60px, 
                        transparent 60px, transparent 120px)`,
                    transform: `translateX(-${stripeOffset}px)`,
                    boxShadow: '0 0 20px rgba(245,181,0,0.5)',
                }} />
            </div>

            {/* BOTTOM CURBS */}
            <div
                style={{
                    position: 'absolute',
                    top: height - bottomCurbHeight,
                    left: -150,
                    width: width + 300,
                    height: bottomCurbHeight,
                    background: `repeating-linear-gradient(90deg, 
                        #ff0000 0px, #ff0000 40px, 
                        #ffffff 40px, #ffffff 80px)`,
                    transform: `translateX(-${stripeOffset * 0.8}px)`,
                }}
            />

            {/* SPEED LINES */}
            {Array.from({ length: 15 }, (_, i) => {
                const y = trackTop + 50 + i * 60;
                const lineSpeed = 10 + (i % 5) * 4;
                const x = ((frame * lineSpeed) % (width + 500)) - 300;

                return (
                    <div
                        key={`line-${i}`}
                        style={{
                            position: 'absolute',
                            left: x,
                            top: y,
                            width: 250,
                            height: 2,
                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)`,
                        }}
                    />
                );
            })}

            {/* SPARKS */}
            {Array.from({ length: 20 }, (_, i) => {
                const baseY = trackTop + 80 + ((i * 47) % 800);
                const sparkSpeed = 6 + (i % 5) * 3;
                const x = ((frame * sparkSpeed + i * 120) % (width + 200)) - 100;
                const y = baseY + Math.sin(frame * 0.1 + i) * 20;

                return (
                    <div
                        key={`spark-${i}`}
                        style={{
                            position: 'absolute',
                            left: x,
                            top: y,
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: i % 3 === 0 ? '#ffcc00' : '#ff6600',
                            boxShadow: `0 0 8px ${i % 3 === 0 ? '#ffcc00' : '#ff6600'}`,
                        }}
                    />
                );
            })}

            {/* HUD - Left speedometer */}
            <div
                style={{
                    position: 'absolute',
                    left: 30,
                    bottom: 60,
                    padding: '20px 30px',
                    background: 'rgba(0,0,0,0.9)',
                    borderRadius: 10,
                    border: '3px solid #ff0000',
                }}
            >
                <div style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>
                    VELOCIDADE
                </div>
                <div style={{
                    color: '#F5B500',
                    fontSize: 48,
                    fontWeight: 'bold',
                    fontFamily: 'Arial Black, sans-serif',
                    lineHeight: 1,
                }}>
                    {Math.round(currentSpeed)}
                    <span style={{ fontSize: 16, color: '#888', marginLeft: 5 }}>KM/H</span>
                </div>
                <div style={{
                    marginTop: 10,
                    height: 8,
                    background: '#333',
                    borderRadius: 4,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(100, (currentSpeed / 200) * 100)}%`,
                        background: 'linear-gradient(90deg, #10b981, #F5B500, #2E6A9C)',
                    }} />
                </div>
            </div>

            {/* HUD - Right telemetry */}
            <div
                style={{
                    position: 'absolute',
                    right: 30,
                    top: 60,
                    padding: 20,
                    background: 'rgba(0,0,0,0.9)',
                    borderRadius: 10,
                    border: '2px solid #444',
                    minWidth: 130,
                }}
            >
                <div style={{ marginBottom: 12 }}>
                    <div style={{ color: '#666', fontSize: 10, fontFamily: 'monospace' }}>GIRO</div>
                    <div style={{ color: '#F5B500', fontSize: 24, fontFamily: 'Arial Black' }}>
                        {Math.round(rpm).toLocaleString()}
                    </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <div style={{ color: '#666', fontSize: 10, fontFamily: 'monospace' }}>MARCHA</div>
                    <div style={{ color: '#2E6A9C', fontSize: 28, fontWeight: 'bold' }}>
                        {gear}
                    </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <div style={{ color: '#666', fontSize: 10, fontFamily: 'monospace' }}>TEMP</div>
                    <div style={{ color: rpm > 8500 ? '#2E6A9C' : '#F5B500', fontSize: 18 }}>
                        {Math.round(70 + currentSpeed * 0.15)}°C
                    </div>
                </div>

                <div>
                    <div style={{ color: '#666', fontSize: 10, fontFamily: 'monospace' }}>PROGRESSO</div>
                    <div style={{ color: '#fff', fontSize: 16 }}>
                        {Math.round(progress * 100)}%
                    </div>
                </div>
            </div>

            {/* HUD - Right position */}
            <div
                style={{
                    position: 'absolute',
                    right: 30,
                    bottom: 60,
                    padding: '15px 25px',
                    background: 'rgba(0,0,0,0.9)',
                    borderRadius: 10,
                    border: '2px solid #444',
                    textAlign: 'center',
                }}
            >
                <div style={{ color: '#666', fontSize: 10, fontFamily: 'monospace' }}>POSIÇÃO</div>
                <div style={{
                    color: ranking === 1 ? '#ffd700' : '#fff',
                    fontSize: 36,
                    fontWeight: 'bold',
                }}>
                    {ranking}
                </div>
            </div>

            {/* Vignette */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                    pointerEvents: 'none',
                }}
            />
        </AbsoluteFill>
    );
};

export default KartRacing;
