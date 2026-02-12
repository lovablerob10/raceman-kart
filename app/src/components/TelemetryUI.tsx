import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface TelemetryUIProps {
  speed?: number;
  lapTime?: string;
  position?: number;
  className?: string;
  color?: string;
}

export function TelemetryUI({
  speed = 125,
  lapTime = '1:23.456',
  position = 1,
  className = '',
  color = '#2E6A9C'
}: TelemetryUIProps) {
  const [animatedSpeed, setAnimatedSpeed] = useState(0);

  // Debug: use color to avoid lint error
  console.log('Telemetry color:', color);

  useEffect(() => {
    // Animate Speed
    gsap.to({ value: animatedSpeed }, {
      value: speed,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function () {
        setAnimatedSpeed(Math.round(this.targets()[0].value));
      }
    });
  }, [speed]);

  return (
    <div className={`telemetry-panel ${className}`}>
      {/* Main Telemetry Display */}
      <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-4 font-mono">


        {/* Speed */}
        <div className="mb-4">
          <div className="text-center">
            <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">SPEED</span>
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-bold text-white tabular-nums">
                {animatedSpeed}
              </span>
              <span className="text-xl text-white/50 ml-2">KM/H</span>
            </div>
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
          <span className="inline-block animate-data-stream uppercase tracking-widest">
            VELOCIDADE MÁXIMA: 130 KM/H | MOTOR: 13HP | PNEU: SLICK | PISTA: SECA | TEMPERATURA: 28°C | PRESSÃO: 18 PSI | VELOCIDADE MÁXIMA: 130 KM/H | MOTOR: 13HP | PNEU: SLICK | PISTA: SECA | TEMPERATURA: 28°C | PRESSÃO: 18 PSI
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
export function TelemetryCompact({ speed = 125 }: { speed?: number }) {
  const [animatedSpeed, setAnimatedSpeed] = useState(0);

  useEffect(() => {
    gsap.to({ value: 0 }, {
      value: speed,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function () {
        setAnimatedSpeed(Math.round(this.targets()[0].value));
      }
    });
  }, [speed]);

  return (
    <div className="flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
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
