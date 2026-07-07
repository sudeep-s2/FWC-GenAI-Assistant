import React, { useState } from 'react';
import { Accessibility, MapPin, Navigation, Send } from 'lucide-react';
import { useAIRequest } from '../../hooks/useAIRequest';
import { useMatchContext } from '../../hooks/useMatchContext';
import AIResponseCard from '../shared/AIResponseCard';

const ACCESS_TYPES = [
  'Wheelchair — Powered',
  'Wheelchair — Manual Push',
  'Visual Impairment',
  'Hearing Impairment',
  'Elderly / Limited Mobility',
  'Sensory Processing Needs',
];

const STADIUM_ZONES = [
  'Light Rail Station ADA Gate',
  'Main Plaza Entrance',
  'Parking Lot P4',
  'Gate ADA-East',
  'Gate A ticket entrance',
  'Gate B ticket entrance',
];

const DESTINATIONS = [
  'Sector A — Section 102',
  'Sector B — Section 204',
  'Sector C — Section 104',
  'Sector D — Section 228',
  'Guest Services Suite',
  'First Aid Station Sector A',
];

const AccessibilityGuardian: React.FC = () => {
  const { currentPhase } = useMatchContext();
  const { response, loading, elapsedMs, processQuery } = useAIRequest();
  
  const [accessType, setAccessType] = useState(ACCESS_TYPES[0]);
  const [currentLocation, setCurrentLocation] = useState(STADIUM_ZONES[0]);
  const [destination, setDestination] = useState(DESTINATIONS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = `Accessibility assistance required for FIFA visitor. Visitor has: ${accessType}. Currently at: ${currentLocation}. Destination: ${destination}. Provide the best accessible route including: ADA ramps, elevator numbers, volunteer escort instructions, and any relevant accommodations from accessibility rules.`;
    await processQuery(query, currentPhase);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-ai-500/20 glow-ai">
        <div className="flex items-center gap-3 mb-1">
          <Accessibility size={20} className="text-ai-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">FIFA 2026 Accessibility Guardian</h2>
        </div>
        <p className="text-slate-400 text-sm">FIFA World Cup 2026 · ADA-compliant pathway planner & elevator routing assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-5 space-y-4" noValidate>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Request Route Assist</h3>

          <div>
            <label htmlFor="acc-type" className="block text-xs text-slate-400 mb-1">
              <Accessibility size={11} className="inline mr-1" aria-hidden="true" />Requirement Type
            </label>
            <select
              id="acc-type"
              value={accessType}
              onChange={e => setAccessType(e.target.value)}
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-ai-500/60 focus:outline-none cursor-pointer"
            >
              {ACCESS_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="acc-current" className="block text-xs text-slate-400 mb-1">
              <MapPin size={11} className="inline mr-1" aria-hidden="true" />Origin Location
            </label>
            <select
              id="acc-current"
              value={currentLocation}
              onChange={e => setCurrentLocation(e.target.value)}
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-ai-500/60 focus:outline-none cursor-pointer"
            >
              {STADIUM_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="acc-dest" className="block text-xs text-slate-400 mb-1">
              <Navigation size={11} className="inline mr-1" aria-hidden="true" />Target Destination
            </label>
            <select
              id="acc-dest"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-ai-500/60 focus:outline-none cursor-pointer"
            >
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-ai-600 hover:bg-ai-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Send size={13} aria-hidden="true" />
            {loading ? 'Finding Path...' : 'Generate Accessible Route'}
          </button>
        </form>

        <div className="lg:col-span-3 space-y-4">
          {/* ADA Directory */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">FIFA ADA Infrastructure</h3>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                { icon: '🛗', label: 'ADA Elevator 3', detail: 'Sector B — Access to wheelchair decks Section 204' },
                { icon: '🛗', label: 'ADA Elevator 4', detail: 'Sector C — Access to wheelchair decks Section 104' },
                { icon: '♿', label: 'ADA Ramp 1', detail: 'Main Transit Plaza → Lower Concourse (1:12 regulation slope)' },
                { icon: '🚌', label: 'ADA Shuttles', detail: 'Operates continuously between Lot P4, Rail Station & Gate A' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stadium-800/40 border border-stadium-700/50">
                  <span className="text-base" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-ai-400">{item.label}</p>
                    <p className="text-[10px] text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {loading && (
            <div className="glass-card p-5 text-center">
              <div className="w-8 h-8 border-2 border-ai-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-xs text-ai-400 font-bold">Querying RAG database for ADA elevators and pathways...</p>
            </div>
          )}

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

export default AccessibilityGuardian;
