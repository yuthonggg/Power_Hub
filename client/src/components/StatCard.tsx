import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'green' | 'amber' | 'blue' | 'purple' | 'red';
  onClick?: () => void;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  color = 'green',
  onClick,
}: StatCardProps) {
  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    green: {
      bg: '#E1F5EE',
      text: '#1D9E75',
      icon: '#1D9E75',
    },
    amber: {
      bg: '#FAEEDA',
      text: '#EF9F27',
      icon: '#EF9F27',
    },
    blue: {
      bg: '#E6F1FB',
      text: '#378ADD',
      icon: '#378ADD',
    },
    purple: {
      bg: '#EEEDFE',
      text: '#7F77DD',
      icon: '#7F77DD',
    },
    red: {
      bg: '#FEE2E2',
      text: '#DC2626',
      icon: '#DC2626',
    },
  };

  const { bg, text, icon: iconColor } = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`
        card-soft p-6 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-bold"
              style={{ color: text }}
            >
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
          {trend && (
            <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bg }}
          >
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
        )}
      </div>
    </div>
  );
}
