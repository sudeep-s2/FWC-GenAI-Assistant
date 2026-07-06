import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Shield, Users, AlertTriangle, Zap, TrendingUp, Bus, Leaf, Play } from 'lucide-react';
import { demoScenarios } from '../../utils/scenarios';
import IncidentLog from './IncidentLog';
import InfoTooltip from '../shared/InfoTooltip';
import AILoadingState from '../shared/AILoadingState';
import AIResponseCard from '../shared/AIResponseCard';
import AIStatusPanel from '../shared/AIStatusPanel';
import { useAI } from '../../hooks/useAI';

const crowdData = [
  { time: '14:00', density: 12 },
  { time: '14:30', density: 28 },
  { time: '15:00', density: 47 },
  { time: '15:30', density: 69 },
  { time: '16:00', density: 84 },
  { time: '16:30', density: 92 },
  { time: '17:00', density: 88 },
  { time: '17:30', density: 76 },
  { time: '18:00', density: 63 },
];

const gateData = [
  { gate: 'A', flow: 850, capacity: 1200 },
  { gate: 'B', flow: 1080, capacity: 1200 },
  { gate: 'C', flow: 650, capacity: 1000 },
  { gate: 'D', flow: 920, capacity: 1200 },
  { gate: 'E', flow: 475, capacity: 800 },
  { gate: 'G', flow: 1185, capacity: 1200 },
];

const priorityColors: Record<string, string> = {
  critical: 'text-red-400 border-red-500/40 bg-red-500/10',
  high:     'text-orange-400 border-orange-500/40 bg-orange-500/10',
  medium:   'text-amber-400 border-amber-500/40 bg-amber-500/10',
  low:      'text-slate-400 border-slate-500/40 bg-slate-500/10',
};

const scenarioIcons: Record<string, string> = {
  'surge':           '🚨',
  'lost-fan':        '🧭',
  'accessibility':   '♿',
  'maintenance':     '🔧',
  'sustainability':  '♻️',
};

const CommandCenter: React.FC = () => {
  const { response, loading, elapsedMs, processQuery } = useAI();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleDemo = async (scenario: typeof demoScenarios[0]) => {
    setActiveDemo(scenario.id);
    const query = `${scenario.title}: ${scenario.description}`;
    await processQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-5 border border-gold-500/20 glow-gold">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-gradient-gold mb-1">
                Mission Control — Command Center
              </h1>
              <InfoTooltip content="Real-time stadium operating hub mapping crowd statistics, active volunteer allocations, and emergency triggers." />
            </div>
            <p className="text-slate-400 text-sm">FIFA World Cup 2026 · Real-time GenAI Operations Twin</p>
          </div>
          
          {/* Start Demo Button */}
          <button
            onClick={() => handleDemo(demoScenarios[0])}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-stadium-950 font-bold text-sm rounded-xl cursor-pointer shadow-md hover:shadow-gold-500/20 transition-all disabled:opacity-50"
            aria-label="Start Quick Demo Tour"
          >
            🚀 Start Demo
          </button>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest">Attendance</p>
              <p className="text-xl font-bold text-gold-400">68,247</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest">Match Phase</p>
              <p className="text-xl font-bold text-crowd-400">PRE-MATCH</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest">Kickoff</p>
              <p className="text-xl font-bold text-emerald-400">17:00 EST</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot" aria-hidden="true" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Users size={20} />, label: 'Crowd Level',     value: '92%',   sub: 'Gate G Critical', color: 'text-red-400',      bg: 'bg-red-500/10',     border: 'border-red-500/30' },
          { icon: <Shield size={20} />, label: 'Gates Open',     value: '6 / 8', sub: '2 at capacity',   color: 'text-crowd-400',   bg: 'bg-crowd-500/10',   border: 'border-crowd-500/30' },
          { icon: <AlertTriangle size={20} />, label: 'Active Incidents', value: '4', sub: '1 critical',  color: 'text-orange-400',   bg: 'bg-orange-500/10',  border: 'border-orange-500/30' },
          { icon: <Zap size={20} />, label: 'Volunteers Active', value: '142',  sub: '12 sectors',        color: 'text-sustain-400',  bg: 'bg-sustain-500/10', border: 'border-sustain-500/30' },
        ].map(kpi => (
          <div key={kpi.label} className={`glass-card p-4 border ${kpi.border} ${kpi.bg}`}>
            <div className={`flex items-center gap-2 mb-2 ${kpi.color}`}>
              {kpi.icon}
              <span className="text-xs text-slate-400">{kpi.label}</span>
            </div>
            <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-crowd-400" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-300">Crowd Density Over Time (%)</h3>
          </div>
          <div role="img" aria-label="Area chart showing crowd density increasing from 12% at 14:00 to a peak of 92% at 16:30 then declining">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={crowdData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ background: '#0f1e38', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e2e8f0' }}
                  formatter={(v) => [`${v ?? 0}%`, 'Density']}
                />
                <Area type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={2} fill="url(#crowdGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bus size={16} className="text-gold-400" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-300">Gate Flow vs. Capacity (fans/hr)</h3>
          </div>
          <div role="img" aria-label="Bar chart comparing gate flow to capacity across gates A through G. Gate G is near full capacity at 1185/1200.">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gateData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="gate" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f1e38', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                <Bar dataKey="capacity" name="Capacity" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flow" name="Flow" fill="#f5c518" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Incidents + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <IncidentLog />

        <div>
          <AIStatusPanel />
        </div>
      </div>

      {/* Judge Demo Mode */}
      <div className="glass-card p-5 border border-ai-500/20 glow-ai">
        <div className="flex items-center gap-2 mb-4">
          <Play size={16} className="text-ai-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Judge Demo Mode — One-Click Scenarios</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Each button triggers the full AI pipeline: Input Sanitization → Intent Detection → RAG Retrieval → Gemini API → Validated Response
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {demoScenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => handleDemo(scenario)}
              disabled={loading}
              aria-label={`Run demo scenario: ${scenario.title}`}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                activeDemo === scenario.id
                  ? 'border-ai-500/60 bg-ai-600/20 scale-[0.98]'
                  : 'border-stadium-500/30 bg-stadium-700/30 hover:border-ai-500/40 hover:bg-ai-600/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-xl mb-1">{scenarioIcons[scenario.type]}</div>
              <p className="text-xs font-semibold text-slate-300 leading-tight">{scenario.title}</p>
              <p className={`text-xs mt-1 font-bold uppercase tracking-wide ${priorityColors[scenario.severity].split(' ')[0]}`}>
                {scenario.severity}
              </p>
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <AILoadingState message="Processing scenario through GenAI twin..." />
        )}

        {/* Response */}
        {response && !loading && (
          <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
        )}
      </div>

      {/* Sustainability strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Leaf size={16} />, label: 'Recycling Rate',   value: '78%',   sub: 'Food Court 3 alert', color: 'text-sustain-400', border: 'border-sustain-500/30', bg: 'bg-sustain-500/10' },
          { icon: <Zap size={16} />, label: 'Energy Usage',      value: '105%',  sub: 'Over baseline',     color: 'text-amber-400',   border: 'border-amber-500/30',  bg: 'bg-amber-500/10' },
          { icon: <Bus size={16} />, label: 'Transit Load',      value: 'Normal',sub: 'All lines running',  color: 'text-crowd-400',   border: 'border-crowd-500/30',  bg: 'bg-crowd-500/10' },
        ].map(m => (
          <div key={m.label} className={`glass-card p-4 border ${m.border} ${m.bg}`}>
            <div className={`flex items-center gap-2 mb-1 ${m.color}`}>
              {m.icon}<span className="text-xs text-slate-400">{m.label}</span>
            </div>
            <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-slate-600 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandCenter;
