import React, { useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Activity, Send, Zap } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import AIResponseCard from '../shared/AIResponseCard';

const QUICK_QUERIES = [
  { label: '🚨 Gate G Surge', query: 'Critical crowd surge at Gate G. Density at 92%, incoming shuttle arrived. Need immediate crowd control recommendations.' },
  { label: '⚠️ High Density Alert', query: 'Crowd density exceeding 4.5 people per square meter near sector C outer perimeter. What are the buffering procedures?' },
  { label: '🔄 Gate Throttle', query: 'Gate B scanner failure. Should we throttle gates and redirect? Capacity is at 90%.' },
  { label: '📢 Evacuation Query', query: 'When and how should we initiate crowd evacuation for sectors A and B? What are the muster points?' },
];

const densityLevel = 92;
const radialData = [{ value: densityLevel, fill: densityLevel > 85 ? '#ef4444' : densityLevel > 65 ? '#f97316' : '#3b82f6' }];

const CrowdPulse: React.FC = () => {
  const [query, setQuery] = useState('');
  const { response, loading, elapsedMs, processQuery } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processQuery(query);
  };

  const handleQuick = async (q: string) => {
    setQuery(q);
    await processQuery(q);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-crowd-500/20 glow-crowd">
        <div className="flex items-center gap-3 mb-1">
          <Activity size={20} className="text-crowd-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">CrowdPulse — AI Risk Analysis</h2>
        </div>
        <p className="text-slate-400 text-sm">Real-time crowd intelligence powered by Gemini AI + Stadium SOPs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Density Gauge */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Current Peak Density</h3>
          <div role="img" aria-label={`Stadium crowd density is currently at ${densityLevel}%, classified as critical`}>
            <ResponsiveContainer width={180} height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={225} endAngle={-45}>
                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#1e3a5f' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-5xl font-bold text-red-400 -mt-6">{densityLevel}%</p>
          <p className="text-xs text-red-400 font-semibold mt-2 uppercase tracking-widest">CRITICAL</p>
          <p className="text-xs text-slate-500 mt-1">Gate G — Outer Perimeter</p>

          <div className="mt-4 w-full space-y-2">
            {[
              { label: 'Gate G', pct: 99, color: 'bg-red-500' },
              { label: 'Gate B', pct: 90, color: 'bg-orange-500' },
              { label: 'Gate D', pct: 77, color: 'bg-amber-500' },
              { label: 'Gate A', pct: 71, color: 'bg-crowd-500' },
            ].map(g => (
              <div key={g.label} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-12">{g.label}</span>
                <div className="flex-1 h-1.5 bg-stadium-500/50 rounded-full overflow-hidden">
                  <div className={`h-full ${g.color} rounded-full transition-all`} style={{ width: `${g.pct}%` }} aria-label={`${g.label}: ${g.pct}% capacity`} />
                </div>
                <span className="text-xs text-slate-500 w-8 text-right">{g.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Query Panel */}
        <div className="glass-card p-5 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Query Crowd Intelligence</h3>

          {/* Quick queries */}
          <div className="grid grid-cols-2 gap-2">
            {QUICK_QUERIES.map(q => (
              <button
                key={q.label}
                onClick={() => handleQuick(q.query)}
                disabled={loading}
                aria-label={`Quick query: ${q.label}`}
                className="text-left p-2.5 rounded-lg border border-stadium-500/30 bg-stadium-700/30 hover:border-crowd-500/40 hover:bg-crowd-600/10 text-xs text-slate-300 transition-all cursor-pointer disabled:opacity-40"
              >
                {q.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="crowd-query" className="text-xs text-slate-500">Custom Query</label>
            <textarea
              id="crowd-query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Describe the crowd situation for AI analysis…"
              rows={3}
              aria-label="Crowd intelligence query input"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-crowd-500/60 focus:outline-none resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-crowd-600 hover:bg-crowd-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all cursor-pointer"
              aria-label="Analyze crowd situation with AI"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />Analyzing…</>
                : <><Zap size={14} aria-hidden="true" />Analyze with AI</>}
            </button>
          </form>

          {response && !loading && (
            <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
          )}
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Density Risk',    value: 'CRITICAL', sub: '4.6 people/m²',  color: 'text-red-400',    border: 'border-red-500/30',    bg: 'bg-red-500/10' },
          { label: 'Queue Spillover', value: 'HIGH',     sub: 'Transit roadway', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
          { label: 'AI Recommendation', value: 'ACTIVE', sub: 'Gemini engine on', color: 'text-ai-400',   border: 'border-ai-500/30',     bg: 'bg-ai-500/10' },
        ].map(r => (
          <div key={r.label} className={`glass-card p-4 text-center border ${r.border} ${r.bg}`}>
            <p className="text-xs text-slate-500 mb-1">{r.label}</p>
            <p className={`text-lg font-bold ${r.color}`}>{r.value}</p>
            <p className="text-xs text-slate-600">{r.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 flex items-start gap-3 border border-red-500/20 bg-red-500/5">
        <Send size={14} className="text-red-400 mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-xs text-slate-400">
          <span className="text-red-400 font-semibold">Live Alert:</span> Gate G outer perimeter density has exceeded safe thresholds. AI has pre-loaded SOP-01 and EM-04 context from the knowledge base. Click a quick query or type your situation above.
        </p>
      </div>
    </div>
  );
};

export default CrowdPulse;
