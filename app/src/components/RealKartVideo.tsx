import { useEffect, useRef, useState } from 'react';

interface RealKartVideoProps {
  progress: number;
  className?: string;
}

/**
 * RealKartVideo - Componente que exibe vídeo de kart real
 * controlado pelo progresso do scroll (scrubbing)
 */
export function RealKartVideo({ progress, className = '' }: RealKartVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Sync video time with progress
  useEffect(() => {
    const video = videoRef.current;
    if (video && isVideoReady && video.duration) {
      // Clamp progress and calculate time
      const safeProgress = Math.max(0, Math.min(1, progress));
      const targetTime = safeProgress * video.duration;

      if (Number.isFinite(targetTime)) {
        video.currentTime = targetTime;
      }
    }
  }, [progress, isVideoReady]);

  // Calculate speed intensity for effects
  const speedIntensity = 1 - Math.abs(progress - 0.5) * 2;

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: '#000' }}
    >
      <video
        ref={videoRef}
        src="/video/kart-video.mp4"
        className="w-full h-full object-cover"
        style={{
          filter: speedIntensity > 0.5
            ? `blur(${Math.floor(speedIntensity * 2)}px)`
            : 'none',
          transform: speedIntensity > 0.7
            ? `translateX(${(Math.random() - 0.5) * speedIntensity * 4}px)`
            : 'none',
        }}
        preload="auto"
        muted
        playsInline
        onLoadedMetadata={() => setIsVideoReady(true)}
      />

      {/* Speed lines overlay */}
      {speedIntensity > 0.3 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent ${100 - speedIntensity * 50}%,
              rgba(255,255,255,${speedIntensity * 0.1}) ${100 - speedIntensity * 50}%,
              rgba(255,255,255,${speedIntensity * 0.1}) 100%
            )`,
            mixBlendMode: 'overlay',
            opacity: speedIntensity
          }}
        />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  );
}
