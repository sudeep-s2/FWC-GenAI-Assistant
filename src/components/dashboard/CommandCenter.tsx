import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Shield, Users, AlertTriangle, Zap, TrendingUp, Bus, Play } from 'lucide-react';
import { demoScenarios } from '../../utils/scenarios';
import IncidentLog from './IncidentLog';
import MetricCard from '../shared/MetricCard';
import StatusBadge from '../shared/StatusBadge';
import AILoadingState from '../shared/AILoadingState';
import AIResponseCard from '../shared/AIResponseCard';
import AIStatusPanel from '../shared/AIStatusPanel';
import { useDemoScenario } from '../../hooks/useDemoScenario';
import { useMatchContext } from '../../hooks/useMatchContext';

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

const scenarioIcons: Record<string, string> = {
  'surge':           '🚨',
  'lost-fan':        '🧭',
  'accessibility':   '♿',
  'maintenance':     '🔧',
  'sustainability':  '♻️',
};

const CommandCenter: React.FC = () => {
  const { currentPhase, phaseInfo, setPhase, phases } = useMatchContext();
  const { activeScenario, loading, response, elapsedMs, triggerScenario } = useDemoScenario();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-5 border border-gold-500/20 glow-gold">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-gradient-gold mb-1">
                FIFA 2026 Matchday Operations Command Center
              </h1>
            </div>
            <p className="text-slate-400 text-sm">FIFA World Cup 2026 · Real-time GenAI Operations Twin</p>
          </div>
          
          {/* Quick Demo Trigger */}
          <button
            onClick={() => triggerScenario(demoScenarios[0], currentPhase)}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-stadium-950 font-bold text-sm rounded-xl cursor-pointer shadow-md hover:shadow-gold-500/20 transition-all disabled:opacity-50"
            aria-label="Start Quick Demo Tour"
          >
            🚀 Run Gate G Scenario
          </button>

          {/* Phase Control selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match Phase:</span>
            <select
              value={currentPhase}
              onChange={(e) => setPhase(e.target.value as any)}
              className="px-3 py-1.5 bg-stadium-800 border border-stadium-700/60 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
            >
              {phases.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Phase focus summary */}
        <div className="mt-3 p-2.5 bg-stadium-900/40 rounded-xl border border-stadium-800/60 text-xs text-slate-400">
          <span className="font-bold text-gold-400 uppercase tracking-wider mr-1.5">Active Operational Focus:</span>
          {phaseInfo.focusArea} ({phaseInfo.description})
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Spectator Load"
          value="92%"
          icon={<Users size={18} />}
          subtext="Gate G Load Critical"
          trend="increasing"
          borderColor="border-red-500/30"
          textColor="text-red-400"
        />
        <MetricCard
          title="Gate Scanners Open"
          value="6 / 8"
          icon={<Shield size={18} />}
          subtext="2 at peak capacity"
          trend="stable"
          borderColor="border-crowd-500/30"
          textColor="text-crowd-400"
        />
        <MetricCard
          title="Active FIFA Incidents"
          value="4"
          icon={<AlertTriangle size={18} />}
          subtext="1 critical hazard"
          trend="increasing"
          borderColor="border-orange-500/30"
          textColor="text-orange-400"
        />
        <MetricCard
          title="Mobilized Volunteers"
          value="142"
          icon={<Zap size={18} />}
          subtext="across 12 concourse sectors"
          trend="stable"
          borderColor="border-sustain-500/30"
          textColor="text-sustain-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-crowd-400" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-300">Live Matchday Crowd Flow Prediction (%)</h3>
          </div>
          <div role="img" aria-label="Area chart showing crowd flow predictions.">
            <ResponsiveContainer width="100%" height={180}>
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
                  contentStyle={{ background: '#0a1220', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e2e8f0' }}
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
            <h3 className="text-sm font-semibold text-slate-300">FIFA Ingress Flow vs. Capacity (fans/hr)</h3>
          </div>
          <div role="img" aria-label="Bar chart comparing flow to capacity.">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={gateData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="gate" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0a1220', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11 }} />
                <Bar dataKey="capacity" name="Capacity" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flow" name="Ingress Flow" fill="#f5c518" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Incidents + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <IncidentLog />
        <AIStatusPanel />
      </div>

      {/* Judge Demo Mode */}
      <div className="glass-card p-5 border border-ai-500/20 glow-ai">
        <div className="flex items-center gap-2 mb-4">
          <Play size={16} className="text-ai-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">FIFA 2026 Operations Demo Center</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Select a matchday scenario to run the complete Generative AI orchestration workflow under the active match phase:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {demoScenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => triggerScenario(scenario, currentPhase)}
              disabled={loading}
              aria-label={`Run demo scenario: ${scenario.title}`}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                activeScenario?.id === scenario.id
                  ? 'border-ai-500/60 bg-ai-600/20 scale-[0.98]'
                  : 'border-stadium-700 bg-stadium-800/40 hover:border-ai-500/40 hover:bg-ai-600/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-xl mb-1">{scenarioIcons[scenario.type]}</div>
              <p className="text-xs font-semibold text-slate-300 leading-tight">{scenario.title}</p>
              <div className="mt-1.5">
                <StatusBadge status={scenario.severity} />
              </div>
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <AILoadingState message="Orchestrating RAG context & running Gemini operations planner..." />
        )}

        {/* Response */}
        {response && !loading && (
          <div className="space-y-4">
            <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
            
            {/* AI Explainability Checklist */}
            {response.factorsConsidered && (
              <div className="p-3 bg-stadium-900/60 rounded-xl border border-stadium-700/50">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">AI Explainability — Factors Considered:</p>
                <div className="flex flex-wrap gap-2">
                  {response.factorsConsidered.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandCenter;
