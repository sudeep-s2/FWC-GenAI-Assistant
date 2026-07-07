import React, { useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Activity, Clock, AlertCircle } from 'lucide-react';
import { useAIRequest } from '../../hooks/useAIRequest';
import { useMatchContext } from '../../hooks/useMatchContext';
import AIResponseCard from '../shared/AIResponseCard';
import StatusBadge from '../shared/StatusBadge';

const QUICK_QUERIES = [
  { label: '🚨 Gate G Ingress Congestion', query: 'Critical spectator surge at Gate G Ticket Entry. Density at 92%, arrival shuttles at peak drop off. Need immediate spacing recommendations.' },
  { label: '⚠️ Perimeter Density Warning', query: 'Spectator density exceeding 4.5 people/m2 near Sector C concourse gates. What are the spacing detour protocols?' },
  { label: '🔄 Scanner Failure Detour', query: 'Gate B ticket scanner network failure. Should we initiate queue redirections to Gate A? Load capacity at 90%.' },
  { label: '📢 Egress Routing Plan', query: 'Spectator egress wave planning for Sectors A and B post-match. What are the primary transit shuttle lanes?' },
];

const CrowdPulse: React.FC = () => {
  const { currentPhase } = useMatchContext();
  const { response, loading, elapsedMs, processQuery } = useAIRequest();
  const [query, setQuery] = useState('');
  
  // 30-minute predictive options state
  const [predLoad, setPredLoad] = useState<number>(85);
  const [predictiveMode, setPredictiveMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredictiveMode(false);
    await processQuery(query, currentPhase);
  };

  const handleQuick = async (q: string) => {
    setQuery(q);
    setPredictiveMode(false);
    await processQuery(q, currentPhase);
  };

  const handlePredictiveForecast = async () => {
    setPredictiveMode(true);
    const forecastPrompt = `Predictive 30-minute crowd risk analysis. Current load is ${predLoad}% at Gate G under match phase: ${currentPhase}. Output predictedRisk, currentRisk, timeWindow, and preventiveActions.`;
    setQuery(forecastPrompt);
    await processQuery(forecastPrompt, currentPhase);
  };

  const densityLevel = 92;
  const radialData = [{ value: densityLevel, fill: densityLevel > 85 ? '#ef4444' : '#f97316' }];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-card p-5 border border-crowd-500/20 glow-crowd">
        <div className="flex items-center gap-3 mb-1">
          <Activity size={20} className="text-crowd-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">Live Matchday Crowd Flow Prediction</h2>
        </div>
        <p className="text-slate-400 text-sm">FIFA World Cup 2026 · Real-time crowd flow forecasting & risk prediction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gauge & Prediction Trigger */}
        <div className="glass-card p-5 space-y-5">
          <div className="flex flex-col items-center">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Gate G Density</h3>
            <div role="img" aria-label={`Stadium crowd density is currently at ${densityLevel}%`}>
              <ResponsiveContainer width={150} height={150}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" data={radialData} startAngle={225} endAngle={-45}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#162948' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-4xl font-bold text-red-400 -mt-5">{densityLevel}%</p>
            <p className="text-[10px] text-red-400 font-bold mt-1 uppercase tracking-widest">CRITICAL LOAD</p>
          </div>

          {/* 30-min Predictive operations dashboard input */}
          <div className="p-3.5 bg-stadium-900/40 rounded-xl border border-stadium-700/50 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock size={14} className="text-gold-400" />
              <p className="text-xs font-bold uppercase tracking-wider">30-Min Crowd Prediction</p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="pred-load-range" className="text-[11px] text-slate-400 flex justify-between">
                <span>Select Current Load:</span>
                <span className="font-bold text-gold-400">{predLoad}%</span>
              </label>
              <input
                id="pred-load-range"
                type="range"
                min="50"
                max="100"
                value={predLoad}
                onChange={(e) => setPredLoad(Number(e.target.value))}
                className="w-full h-1 bg-stadium-600 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
            </div>

            <button
              onClick={handlePredictiveForecast}
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-stadium-950 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              📊 Forecast Next 30 Mins
            </button>
          </div>
        </div>

        {/* Right Column: Query & Prediction Outputs */}
        <div className="glass-card p-5 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Query FIFA Crowd SOPs</h3>

          <div className="grid grid-cols-2 gap-2">
            {QUICK_QUERIES.map(q => (
              <button
                key={q.label}
                onClick={() => handleQuick(q.query)}
                disabled={loading}
                className="text-left p-2.5 rounded-lg border border-stadium-700 bg-stadium-800/40 hover:border-crowd-500/40 hover:bg-crowd-600/10 text-xs text-slate-300 transition-all cursor-pointer disabled:opacity-40"
              >
                {q.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              id="crowd-query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Describe crowd situation or custom query details..."
              rows={2}
              className="w-full bg-stadium-800/60 border border-stadium-700/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-crowd-500/60 focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-crowd-600 hover:bg-crowd-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
            >
              {loading ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </form>

          {/* Loading Indicator */}
          {loading && (
            <div className="animate-pulse space-y-2 p-3 bg-stadium-900/30 rounded-xl border border-stadium-800/40">
              <div className="h-4 bg-stadium-600 rounded w-1/3"></div>
              <div className="h-3 bg-stadium-750 rounded w-full"></div>
              <div className="h-3 bg-stadium-750 rounded w-5/6"></div>
            </div>
          )}

          {/* AI Predictor Response Display */}
          {response && !loading && (
            <div className="space-y-4">
              {predictiveMode ? (
                <div className="p-4 bg-stadium-900/60 rounded-xl border border-gold-500/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest">30-Min Crowd Risk Forecast</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Time Window: Next 30 minutes</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block">CURRENT</span>
                        <StatusBadge status={predLoad > 85 ? 'high' : 'medium'} />
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block">PREDICTED</span>
                        <StatusBadge status={predLoad > 75 ? 'critical' : 'high'} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-stadium-800/40 p-2.5 rounded-lg border border-stadium-700/50">
                    {response.content}
                  </p>

                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preventive Action Plan:</h5>
                    <ul className="space-y-1">
                      {response.actions.map((act, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-gold-400 font-bold mt-0.5">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
              )}

              {/* Explainability factors */}
              {response.factorsConsidered && (
                <div className="p-3 bg-stadium-900/60 rounded-xl border border-stadium-700/50">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">AI Explainability — Factors Considered:</p>
                  <div className="flex flex-wrap gap-2">
                    {response.factorsConsidered.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-medium">
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

      {/* Live Warning strip */}
      <div className="glass-card p-4 flex items-start gap-3 border border-red-500/20 bg-red-500/5">
        <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-xs text-slate-400">
          <span className="text-red-400 font-semibold">FIFA operations notice:</span> Live sensors indicate Gate G ingress queues are growing. Running the 30-min forecast will query RAG SOP-01 guides and display mitigation tasks for local teams.
        </p>
      </div>
    </div>
  );
};

export default CrowdPulse;
