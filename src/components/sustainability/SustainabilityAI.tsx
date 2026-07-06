import React, { useState } from 'react';
import { Leaf, Send, BarChart2, AlertCircle } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import AIResponseCard from '../shared/AIResponseCard';

const SUSTAIN_TOPICS = [
  { label: 'Bin Contamination', query: 'Zero-waste audit shows 62% plastic bottle contamination in organic bins at Food Court 3. Generate action plan to correct spectator recycling behavior.' },
  { label: 'Energy Management', query: 'Concession stands in Sector B show 105% energy consumption above baseline. Suggest micro-grid optimization steps to reduce peak load.' },
  { label: 'Public Transit Incentives', query: 'Shuttle buses are running at maximum capacity, but light rail is under-utilized. How can we optimize spectator transport flow to reduce emissions?' },
  { label: 'Water Conservation', query: 'Hydration plan is active due to extreme heat (36C). Provide water-saving measures for mist fans and public facilities.' },
];

const SustainabilityAI: React.FC = () => {
  const [customQuery, setCustomQuery] = useState('');
  const { response, loading, elapsedMs, processQuery } = useAI();

  const handleTopicClick = async (query: string) => {
    setCustomQuery(query);
    await processQuery(query);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    await processQuery(customQuery);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-sustain-500/20 glow-sustain">
        <div className="flex items-center gap-3 mb-1">
          <Leaf size={20} className="text-sustain-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">SustainabilityAI — Zero-Waste & Energy Optimizer</h2>
        </div>
        <p className="text-slate-400 text-sm">AI optimization recommendations and metrics to achieve zero-waste goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Sustainability Diagnostics</h3>
            <p className="text-xs text-slate-500">Select an operational warning area to generate an AI-guided mitigation plan:</p>

            <div className="space-y-2">
              {SUSTAIN_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleTopicClick(topic.query)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-lg border border-stadium-500/30 bg-stadium-700/30 hover:border-sustain-500/40 hover:bg-sustain-600/10 text-xs text-slate-300 transition-all cursor-pointer disabled:opacity-40"
                >
                  <div className="font-semibold text-sustain-400 mb-1">{topic.label}</div>
                  <div className="text-slate-400 line-clamp-2">{topic.query}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-stadium-500/20 space-y-3">
              <label htmlFor="sustain-query" className="block text-xs text-slate-400">Custom Sustainability Query</label>
              <textarea
                id="sustain-query"
                rows={3}
                value={customQuery}
                onChange={e => setCustomQuery(e.target.value)}
                placeholder="Ask about recycling, energy, water, or transit carbon footprints..."
                className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-sustain-500/60 focus:outline-none resize-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !customQuery.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-sustain-600 hover:bg-sustain-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all cursor-pointer"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Calculating...</>
                  : <><Send size={14} />Analyze Optimization</>}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Metrics & Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} className="text-sustain-400" />
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Sustainability Dashboard</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Composting rate', val: '84%', trend: '+4% vs pre-match' },
                { label: 'Recycled tonnage', val: '12.4 T', trend: 'Target: 15.0 T' },
                { label: 'Carbon footprint offset', val: '4.2 Tons', trend: 'Match goal: 6.0 Tons' },
                { label: 'Transit utilisation', val: '68%', trend: 'Subways at capacity' }
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-lg bg-stadium-700/40 border border-stadium-500/20">
                  <div className="text-xs text-slate-400">{m.label}</div>
                  <div className="text-xl font-bold text-sustain-400 mt-1">{m.val}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.trend}</div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-xs text-amber-400 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Food Court 3 plastic contamination remains elevated. Immediate volunteer dispatch is recommended to supervise trash stations.
              </span>
            </div>
          </div>

          {/* AI Response Display */}
          {response && !loading && (
            <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
          )}

          {loading && (
            <div className="glass-card p-5 text-center">
              <div className="w-8 h-8 border-2 border-sustain-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-sustain-400 font-medium">Analyzing eco-optimization parameters...</p>
              <p className="text-xs text-slate-500 mt-1">Grounded in volunteer roles and venue SOP guidelines</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityAI;
