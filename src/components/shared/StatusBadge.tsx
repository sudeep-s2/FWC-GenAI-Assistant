import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'priority' | 'confidence' | 'level' | 'default';
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'default',
  size = 'sm'
}) => {
  const getStyle = (): string => {
    const val = status.toLowerCase();
    
    // Priority / Level colors
    if (val === 'critical' || val === 'high' || val === 'red') {
      return 'bg-red-500/10 text-red-400 border border-red-500/30';
    }
    if (val === 'medium' || val === 'warning' || val === 'orange' || val === 'yellow') {
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    }
    if (val === 'low' || val === 'normal' || val === 'resolved' || val === 'green' || val === 'completed') {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    }
    if (val === 'reported' || val === 'pending') {
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
    }
    if (val === 'dispatching' || val === 'assigned') {
      return 'bg-violet-500/10 text-violet-400 border border-violet-500/30';
    }

    // Confidence / Source specific styling
    if (type === 'confidence') {
      if (val === 'high') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold';
      if (val === 'medium') return 'bg-blue-500/15 text-blue-400 border border-blue-500/20 font-semibold';
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/20';
    }

    return 'bg-slate-800 text-slate-300 border border-slate-700/50';
  };

  return (
    <span className={`inline-flex items-center rounded-lg font-medium uppercase tracking-wider ${
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
    } ${getStyle()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
