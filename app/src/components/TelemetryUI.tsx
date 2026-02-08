import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface TelemetryUIProps {
  rpm?: number;
  speed?: number;
  gear?: number;
  lapTime?: string;
  position?: number;
  className?: string;
  color?: string;
}

export function TelemetryUI({
  rpm = 8500,
  speed = 185,
  gear = 4,
  lapTime = '1:23.456',
  position = 1,
  className = '',
  color = '#2E6A9C'
}: TelemetryUIProps) {
  const rpmBarRef = useRef<HTMLDivElement>(null);
  const [animatedRpm, setAnimatedRpm] = useState(0);
  const [animatedSpeed, setAnimatedSpeed] = useState(0);

  // Debug: use color to avoid lint error
  console.log('Telemetry color:', color);

  useEffect(() => {
    // Animate RPM
    gsap.to({ value: animatedRpm }, {
      value: rpm,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: function () {
        setAnimatedRpm(Math.round(this.targets()[0].value));
      }
    });

    // Animate Speed
    gsap.to({ value: animatedSpeed }, {
      value: speed,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function () {
        setAnimatedSpeed(Math.round(this.targets()[0].value));
      }
    });

    // RPM bar animation
    if (rpmBarRef.current) {
      const percentage = (rpm / 15000) * 100;
      gsap.to(rpmBarRef.current, {
        width: `${percentage}%`,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [rpm, speed]);

  const getRpmColor = (value: number) => {
    if (value > 12000) return '#F5B500'; // Brand Yellow
    if (value > 9000) return '#2E6A9C';  // Brand Blue
    return '#666';
  };

  return (
    <div className={`telemetry-panel ${className}`}>
      {/* Main Telemetry Display */}
      <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-4 font-mono">
        {/* RPM Gauge */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-white/50 uppercase tracking-wider">RPM</span>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: getRpmColor(animatedRpm) }}
            >
              {animatedRpm.toLocaleString()}
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={rpmBarRef}
              className="h-full rounded-full transition-all"
              style={{
                width: '0%',
                background: `linear-gradient(90deg, ${color}33 0%, ${color} 100%)`
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-white/30">
            <span>0</span>
            <span>5K</span>
            <span>10K</span>
            <span>15K</span>
          </div>
        </div>

        {/* Speed & Gear */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">SPEED</span>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-white tabular-nums">
                {animatedSpeed}
              </span>
              <span className="text-sm text-white/50 ml-1">KM/H</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">GEAR</span>
            <span
              className="text-5xl font-bold italic"
              style={{
                color: gear >= 5 ? '#F5B500' : '#2E6A9C',
                textShadow: gear >= 5 ? '0 0 20px rgba(245, 181, 0, 0.4)' : 'none'
              }}
            >
              {gear}
            </span>
          </div>
        </div>

        {/* Lap Info */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">LAP TIME</span>
            <span className="text-lg font-bold text-white tabular-nums">{lapTime}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">POSITION</span>
            <div className="flex items-center justify-end gap-2">
              <span className="text-2xl font-bold" style={{ color: position === 1 ? '#FFD700' : '#fff' }}>
                P{position}
              </span>
              {position === 1 && (
                <span className="text-yellow-500 text-lg">★</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Stream */}
      <div className="mt-2 bg-black/50 backdrop-blur-sm rounded px-3 py-1 overflow-hidden">
        <div className="data-stream text-[10px] text-white/30 whitespace-nowrap">
          <span className="inline-block animate-data-stream">
            TIRE: 85°C | BRAKE: 320°C | ENGINE: 95°C | FUEL: 12.5L | ERS: 65% | DRS: ENABLED | TIRE: 85°C | BRAKE: 320°C | ENGINE: 95°C | FUEL: 12.5L | ERS: 65% | DRS: ENABLED
          </span>
        </div>
      </div>

      <style>{`
        @keyframes data-stream {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-data-stream {
          animation: data-stream 15s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Compact version for smaller spaces
export function TelemetryCompact({ rpm = 8500, speed = 185 }: { rpm?: number; speed?: number }) {
  const [animatedRpm, setAnimatedRpm] = useState(0);
  const [animatedSpeed, setAnimatedSpeed] = useState(0);

  useEffect(() => {
    gsap.to({ value: 0 }, {
      value: rpm,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: function () {
        setAnimatedRpm(Math.round(this.targets()[0].value));
      }
    });
    gsap.to({ value: 0 }, {
      value: speed,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function () {
        setAnimatedSpeed(Math.round(this.targets()[0].value));
      }
    });
  }, [rpm, speed]);

  return (
    <div className="flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/50 uppercase">RPM</span>
        <span className="text-lg font-mono font-bold text-[#F5B500] tabular-nums">
          {animatedRpm.toLocaleString()}
        </span>
      </div>
      <div className="w-px h-6 bg-white/20" />
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/50 uppercase">SPEED</span>
        <span className="text-lg font-mono font-bold text-white tabular-nums">
          {animatedSpeed}
        </span>
        <span className="text-[10px] text-white/50">KM/H</span>
      </div>
    </div>
  );
}

export default TelemetryUI;
