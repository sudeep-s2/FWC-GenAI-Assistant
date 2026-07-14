import React, { useState } from 'react';
import { HelpCircle, Play, Sparkles, AlertCircle } from 'lucide-react';
import type { AIResponse } from '../../types';
import AIResponseCard from '../shared/AIResponseCard';
import LoadingState from '../shared/LoadingState';

interface WhatIfSimulatorProps {
  onRunSimulation: (query: string) => Promise<void>;
  loading: boolean;
  response: AIResponse | null;
  elapsedMs: number | null;
}

const PRESET_SCENARIOS = [
  {
    label: "🏥 What if two medical emergency teams become unavailable in Sector B?",
    query: "[What-If Simulation] Two medical standby crews in Sector B are dispatched and now unavailable. Assess cascade risks and outline emergency staffing redirection plans under current density load."
  },
  {
    label: "🚧 What if Gate B is completely closed due to scanner breakdown?",
    query: "[What-If Simulation] Gate B ticket scanners suffer general power failure, forcing Gate B closure. Sim operations twin: redirect spectator streams and model egress queues at auxiliary gates."
  },
  {
    label: "🌧️ What if heavy rain starts in 20 minutes before kickoff?",
    query: "[What-If Simulation] Unexpected storm front with torrential rain arriving in 20 minutes before match kickoff. Evaluate crowd pacing buffer, shelter coverage capacity in concourses, and slip hazards."
  },
  {
    label: "🚆 What if 15,000 extra fans arrive at the light rail exit in 10 minutes?",
    query: "[What-If Simulation] Mass transit bottleneck: Extra train arrivals dump 15,000 additional spectators at the light rail exits in 10 minutes. Draft buffering, usher deployment, and lane pacing SOPs."
  }
];

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  onRunSimulation,
  loading,
  response,
  elapsedMs
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryToRun = customQuery.trim() || selectedPreset;
    if (!queryToRun) {
      setError('Please select a preset scenario or type a custom "What-If" question.');
      return;
    }
    setError(null);
    await onRunSimulation(queryToRun);
  };

  const handlePresetSelect = (val: string) => {
    setSelectedPreset(val);
    setCustomQuery(''); // Clear custom input when choosing a preset
  };

  // We only show response in this widget if it is indeed a simulation response triggered from this form
  const isSimulationResponse = response && response.content.includes('[What-If Simulation]');

  return (
    <div className="glass-card p-5 border border-gold-500/20 glow-gold relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-gold-500/10 rounded-lg text-gold-400 border border-gold-500/20">
          <HelpCircle size={16} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-widest font-display">
            Scenario Simulator ("What If?" Mode)
          </h3>
          <p className="text-xs text-slate-400">
            Simulate operational impacts and recommend proactive contingency plans.
          </p>
        </div>
      </div>

      <form onSubmit={handleRun} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="preset-simulation" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Preset Contingency Simulation:
          </label>
          <select
            id="preset-simulation"
            value={selectedPreset}
            onChange={(e) => handlePresetSelect(e.target.value)}
            className="w-full bg-stadium-900 border border-stadium-750 text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all cursor-pointer"
          >
            <option value="">-- Choose a standard simulation scenario --</option>
            {PRESET_SCENARIOS.map((s, idx) => (
              <option key={idx} value={s.query}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex items-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-stadium-850" />
          </div>
          <div className="relative flex justify-center text-xs uppercase w-full">
            <span className="bg-stadium-900 px-2 text-[10px] text-slate-500 font-bold tracking-widest">Or Type Custom</span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="custom-simulation" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Custom "What If?" Scenario:
          </label>
          <input
            id="custom-simulation"
            type="text"
            placeholder="e.g., What if the elevator in Gate G breaks down?"
            value={customQuery}
            onChange={(e) => {
              setCustomQuery(e.target.value);
              setSelectedPreset(''); // Deselect preset when typing custom
            }}
            className="w-full bg-stadium-900 border border-stadium-750 text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all placeholder:text-slate-600"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20" role="alert">
            <AlertCircle size={13} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-stadium-950 font-bold py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={14} fill="currentColor" aria-hidden="true" />
          <span>Run Operations Simulation</span>
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="mt-4">
          <LoadingState type="ai" message="Modeling operational impact twin & calculating contingency vectors..." />
        </div>
      )}

      {/* Results */}
      {isSimulationResponse && !loading && (
        <div className="mt-4 space-y-4 fade-slide-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-gold-400 bg-gold-500/10 px-3 py-1.5 rounded-lg border border-gold-500/20">
            <Sparkles size={12} />
            <span>Contingency Simulation Mode Active — Predictive Impact Analysis Generated:</span>
          </div>
          <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
