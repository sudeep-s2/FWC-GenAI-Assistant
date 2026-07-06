import React, { useEffect, useState } from 'react';
import { Activity, Database, CloudOff, Zap, TrendingUp } from 'lucide-react';
import { AICache } from '../../services/aiCache';
import { getSessionCallsRemaining } from '../../utils/security';

const cache = new AICache();

interface StatusMetrics {
  geminiCalls: number;
  cacheHits: number;
  fallbackActivations: number;
  sessionCallsRemaining: number;
}

const AIStatusPanel: React.FC = React.memo(() => {
  const [metrics, setMetrics] = useState<StatusMetrics>({
    geminiCalls: 0,
    cacheHits: 0,
    fallbackActivations: 0,
    sessionCallsRemaining: 30,
  });

  useEffect(() => {
    const refresh = () => {
      const m = cache.getMetrics();
      setMetrics({
        geminiCalls: m.geminiCalls,
        cacheHits: m.cacheHits,
        fallbackActivations: m.fallbackActivations,
        sessionCallsRemaining: getSessionCallsRemaining(),
      });
    };
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const used = 30 - metrics.sessionCallsRemaining;
  const usedPct = Math.round((used / 30) * 100);
  const geminiActive = metrics.fallbackActivations === 0 || metrics.geminiCalls > 0;

  const stats = [
    {
      icon: <Activity size={16} aria-hidden="true" />,
      label: 'Gemini Status',
      value: geminiActive ? 'Active' : 'Offline',
      sub: metrics.sessionCallsRemaining > 0 ? `${metrics.sessionCallsRemaining} calls left` : 'Limit reached',
      color: geminiActive ? 'text-emerald-400' : 'text-red-400',
      border: geminiActive ? 'border-emerald-500/30' : 'border-red-500/30',
      bg: geminiActive ? 'bg-emerald-500/10' : 'bg-red-500/10',
    },
    {
      icon: <Zap size={16} aria-hidden="true" />,
      label: 'API Calls Used',
      value: `${used} / 30`,
      sub: `${usedPct}% of session quota`,
      color: usedPct > 80 ? 'text-red-400' : usedPct > 50 ? 'text-amber-400' : 'text-crowd-400',
      border: 'border-crowd-500/30',
      bg: 'bg-crowd-500/10',
    },
    {
      icon: <Database size={16} aria-hidden="true" />,
      label: 'Cache Hits',
      value: String(metrics.cacheHits),
      sub: 'Reused responses',
      color: 'text-sustain-400',
      border: 'border-sustain-500/30',
      bg: 'bg-sustain-500/10',
    },
    {
      icon: <CloudOff size={16} aria-hidden="true" />,
      label: 'Fallback Count',
      value: String(metrics.fallbackActivations),
      sub: 'Offline intelligence',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div
      className="glass-card p-4"
      role="region"
      aria-label="AI System Status Panel"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-gold-500" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">AI System Status</h3>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" aria-hidden="true" />
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-lg p-3 border ${s.border} ${s.bg}`}>
            <div className={`flex items-center gap-2 mb-1 ${s.color}`}>
              {s.icon}
              <span className="text-xs text-slate-400">{s.label}</span>
            </div>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Session quota progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Session Quota</span>
          <span>{usedPct}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={usedPct} aria-valuemin={0} aria-valuemax={100} aria-label="Session API quota usage">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usedPct > 80 ? 'bg-red-500' : usedPct > 50 ? 'bg-amber-500' : 'bg-crowd-500'
            }`}
            style={{ width: `${usedPct}%` }}
          />
        </div>
      </div>
    </div>
  );
});

AIStatusPanel.displayName = 'AIStatusPanel';
export default AIStatusPanel;
