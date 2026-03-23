import { useEffect, useRef } from 'react';

interface RealKartVideoProps {
  progress: number;
  className?: string;
}

/**
 * RealKartVideo - Componente que exibe vídeo de kart real
 * em loop contínuo lento (autoplay)
 */
export function RealKartVideo({ className = '' }: RealKartVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set slow playback speed once video is ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      video.playbackRate = 0.4;
      video.play().catch(() => {
        // Autoplay might be blocked; will play on user interaction
      });
    };

    if (video.readyState >= 1) {
      handleReady();
    } else {
      video.addEventListener('loadedmetadata', handleReady);
      return () => video.removeEventListener('loadedmetadata', handleReady);
    }
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: '#000' }}
    >
      <video
        ref={videoRef}
        src="/video/kart-video.mp4"
        className="w-full h-full object-cover"
        preload="auto"
        muted
        loop
        playsInline
        autoPlay
      />

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
