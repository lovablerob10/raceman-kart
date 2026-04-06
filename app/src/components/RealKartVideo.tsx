import { useEffect, useRef, useCallback } from 'react';

interface RealKartVideoProps {
  progress: number;
  className?: string;
  /** When true, unmutes the video audio */
  audioEnabled?: boolean;
  /** Called each time the video completes a loop (count = total loops completed) */
  onLoopCount?: (count: number) => void;
}

/**
 * RealKartVideo - Componente que exibe vídeo de kart real
 * em loop contínuo lento (autoplay)
 *
 * Supports controlled audio: parent can enable/disable via audioEnabled prop.
 * Reports loop count via onLoopCount so parent can mute after N loops.
 */
export function RealKartVideo({ className = '', audioEnabled = false, onLoopCount }: RealKartVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopCountRef = useRef(0);

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

  // ── Audio control ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (audioEnabled) {
      video.muted = false;
      // Reset loop counter when audio is freshly enabled
      loopCountRef.current = 0;

      // IMPORTANT: browsers may pause the video when unmuting during autoplay.
      // We must call play() again and handle the rejection gracefully.
      video.play().catch(() => {
        // Browser blocked unmuted playback — re-mute and keep playing silently
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.muted = true;
    }
  }, [audioEnabled]);

  // ── Loop counting ──
  const handleVideoLoop = useCallback(() => {
    if (!audioEnabled) return;
    loopCountRef.current += 1;
    onLoopCount?.(loopCountRef.current);
  }, [audioEnabled, onLoopCount]);

  // We use the 'ended' event won't fire with loop attr, so we listen to 'timeupdate'
  // and manually detect when the video restarts. Alternative: use 'seeked' after loop rewind.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastTime = 0;

    const onTimeUpdate = () => {
      // Detect loop: current time jumped backwards significantly
      if (video.currentTime < lastTime - 1) {
        handleVideoLoop();
      }
      lastTime = video.currentTime;
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [handleVideoLoop]);

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
