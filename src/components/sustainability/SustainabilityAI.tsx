import React, { useState } from 'react';
import { Leaf, BarChart2, AlertCircle } from 'lucide-react';
import { useAIRequest } from '../../hooks/useAIRequest';
import { useMatchContext } from '../../hooks/useMatchContext';
import AIResponseCard from '../shared/AIResponseCard';

const SUSTAIN_TOPICS = [
  { label: 'Plastics Bin Contamination', query: 'Zero-waste audit shows 62% plastic bottle contamination in organic bins at Concourse Food Plaza 3. Generate action plan to correct spectator recycling behavior.' },
  { label: 'Concourse Energy Management', query: 'Concession stands in Sector B show 105% energy consumption above baseline. Suggest micro-grid optimization steps to reduce peak load.' },
  { label: 'Transit Load Balance', query: 'Shuttle buses are running at maximum capacity, but light rail is under-utilized. How can we optimize spectator transport flow to reduce emissions?' },
  { label: 'Water Conservation', query: 'Hydration plan is active due to extreme heat (36C). Provide water-saving measures for mist fans and public facilities.' },
];

const SustainabilityAI: React.FC = () => {
  const { currentPhase } = useMatchContext();
  const { response, loading, elapsedMs, processQuery } = useAIRequest();
  const [customQuery, setCustomQuery] = useState('');

  const handleTopicClick = async (query: string) => {
    setCustomQuery(query);
    await processQuery(query, currentPhase);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    await processQuery(customQuery, currentPhase);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-sustain-500/20 glow-sustain">
        <div className="flex items-center gap-3 mb-1">
          <Leaf size={20} className="text-sustain-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">FIFA 2026 Sustainability & Waste Optimizer</h2>
        </div>
        <p className="text-slate-400 text-sm">FIFA World Cup 2026 · Carbon footprint diagnostics and zero-waste checks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-display">Eco Diagnostics</h3>
            <p className="text-xs text-slate-500 font-display">Select an operational warning area to generate an AI-guided mitigation plan:</p>

            <div className="space-y-2">
              {SUSTAIN_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleTopicClick(topic.query)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-lg border border-stadium-700 bg-stadium-850/50 hover:border-sustain-500/40 hover:bg-sustain-600/10 text-xs text-slate-300 transition-all cursor-pointer disabled:opacity-40"
                >
                  <div className="font-semibold text-sustain-400 mb-1">{topic.label}</div>
                  <div className="text-slate-400 line-clamp-2 text-[11px] leading-tight">{topic.query}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-stadium-700 space-y-3">
              <label htmlFor="sustain-query" className="block text-xs text-slate-400">Custom Sustainability Query</label>
              <textarea
                id="sustain-query"
                rows={2}
                value={customQuery}
                onChange={e => setCustomQuery(e.target.value)}
                placeholder="Ask about zero-waste, energy optimization or carbon offset scopes..."
                className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-655 focus:border-sustain-500/60 focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={loading || !customQuery.trim()}
                className="px-4 py-2 bg-sustain-600 hover:bg-sustain-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
              >
                {loading ? 'Calculating...' : 'Analyze Optimization'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Metrics & Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} className="text-sustain-400" />
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-display">Sustainability Metrics</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              {[
                { label: 'Dual-compost sorting rate', val: '84%', trend: '+4% vs baseline' },
                { label: 'Recycled tonnage', val: '12.4 T', trend: 'FIFA Target: 15.0 T' },
                { label: 'Carbon footprint offset', val: '4.2 Tons', trend: 'Goal: 6.0 Tons' },
                { label: 'Public transit share', val: '68%', trend: 'Subways at capacity' }
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-lg bg-stadium-800/40 border border-stadium-700/50">
                  <div className="text-slate-400">{m.label}</div>
                  <div className="text-lg font-bold text-sustain-400 mt-1">{m.val}</div>
                  <div className="text-slate-500 mt-0.5">{m.trend}</div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-[11px] text-amber-400 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Waste compliance warning:</strong> Concourse Plaza 3 plastic sorting is below threshold. Dispatch volunteer monitors to prevent contamination.
              </span>
            </div>
          </div>

          {/* AI Response Display */}
          {response && !loading && (
            <div className="space-y-4">
              <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
              
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
    </div>
  );
};

export default SustainabilityAI;
