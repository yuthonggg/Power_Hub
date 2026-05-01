import React from 'react';

interface EnergyMeterProps {
  value: number; // 0-100
  label: string;
  unit?: string;
  color?: 'green' | 'amber' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

export default function EnergyMeter({
  value,
  label,
  unit = '%',
  color = 'green',
  size = 'md',
}: EnergyMeterProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const colorMap = {
    green: { bg: '#E1F5EE', stroke: '#1D9E75', text: '#1D9E75' },
    amber: { bg: '#FAEEDA', stroke: '#EF9F27', text: '#EF9F27' },
    red: { bg: '#FEE2E2', stroke: '#DC2626', text: '#DC2626' },
    blue: { bg: '#E6F1FB', stroke: '#378ADD', text: '#378ADD' },
  };

  const sizeMap = {
    sm: { width: 120, textSize: 'text-lg' },
    md: { width: 160, textSize: 'text-2xl' },
    lg: { width: 200, textSize: 'text-3xl' },
  };

  const { bg, stroke, text } = colorMap[color];
  const { width, textSize } = sizeMap[size];

  return (
    <div className="flex flex-col items-center">
      <div style={{ width, height: width }} className="relative flex items-center justify-center">
        <svg
          width={width}
          height={width}
          className="transform -rotate-90"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r="45"
            fill="none"
            stroke={bg}
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r="45"
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease',
            }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`${textSize} font-bold`} style={{ color: text }}>
            {clampedValue.toFixed(0)}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      
      <p className="mt-3 text-sm font-medium text-center">{label}</p>
    </div>
  );
}
