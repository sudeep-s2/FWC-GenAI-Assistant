import React from 'react';
import InfoTooltip from './InfoTooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtext?: string;
  trend?: 'increasing' | 'stable' | 'decreasing';
  trendText?: string;
  tooltipContent?: string;
  borderColor?: string;
  textColor?: string;
  glow?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  subtext,
  trend,
  trendText,
  tooltipContent,
  borderColor = 'border-slate-800',
  textColor = 'text-slate-100',
  glow = false
}) => {
  return (
    <div className={`glass-card p-4 border ${borderColor} transition-all duration-300 ${glow ? 'glow-gold' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          {tooltipContent && (
            <InfoTooltip content={tooltipContent} label={`${title} Info`} />
          )}
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <p className={`text-2xl font-bold font-display ${textColor}`}>{value}</p>
      {subtext && (
        <div className="flex items-center gap-1.5 mt-1">
          {trend && (
            <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${
              trend === 'increasing' ? 'bg-red-500' : trend === 'decreasing' ? 'bg-emerald-500' : 'bg-slate-500'
            }`} />
          )}
          <span className="text-xs text-slate-400">
            {trendText ? `${trendText} ` : ''}{subtext}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
