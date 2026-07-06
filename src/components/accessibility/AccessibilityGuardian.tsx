import React, { useState } from 'react';
import { Accessibility, MapPin, Navigation, Send } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import AIResponseCard from '../shared/AIResponseCard';

const ACCESS_TYPES = [
  'Wheelchair — Powered',
  'Wheelchair — Manual Push',
  'Visual Impairment',
  'Hearing Impairment',
  'Elderly / Limited Mobility',
  'Sensory Processing Needs',
  'Cognitive Accessibility',
];

const STADIUM_ZONES = [
  'Light Rail Station ADA Gate',
  'Main Plaza Entrance',
  'Parking Lot P4',
  'Gate ADA-East',
  'Gate A',
  'Gate B',
  'Gate D',
  'Concourse Level 1',
  'Concourse Level 2',
];

const DESTINATIONS = [
  'Sector A — Section 102',
  'Sector B — Section 204',
  'Sector C — Section 104',
  'Sector D — Section 228',
  'Guest Services Suite',
  'First Aid Station Sector A',
  'Quiet Room A-102',
  'Quiet Room D-205',
  'Food Court 2',
];

const AccessibilityGuardian: React.FC = () => {
  const [accessType, setAccessType] = useState(ACCESS_TYPES[0]);
  const [currentLocation, setCurrentLocation] = useState(STADIUM_ZONES[0]);
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const { response, loading, elapsedMs, processQuery } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = `Accessibility assistance required. Visitor has: ${accessType}. Currently at: ${currentLocation}. Destination: ${destination}. Provide the best accessible route including: ADA ramps, elevator numbers, volunteer escort instructions, and any relevant accommodations from the accessibility guidelines.`;
    await processQuery(query);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-ai-500/20 glow-ai">
        <div className="flex items-center gap-3 mb-1">
          <Accessibility size={20} className="text-ai-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">Accessibility Guardian — AI Routing Assistant</h2>
        </div>
        <p className="text-slate-400 text-sm">ADA-compliant pathways and accommodations powered by Gemini AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-6 space-y-5" noValidate aria-label="Accessibility assistance request form">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Request Assistance</h3>

          <div>
            <label htmlFor="acc-type" className="block text-xs text-slate-400 mb-1.5">
              <Accessibility size={11} className="inline mr-1" aria-hidden="true" />Accessibility Requirement
            </label>
            <select
              id="acc-type"
              value={accessType}
              onChange={e => setAccessType(e.target.value)}
              aria-label="Select accessibility type"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-ai-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {ACCESS_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="acc-current" className="block text-xs text-slate-400 mb-1.5">
              <MapPin size={11} className="inline mr-1" aria-hidden="true" />Current Location
            </label>
            <select
              id="acc-current"
              value={currentLocation}
              onChange={e => setCurrentLocation(e.target.value)}
              aria-label="Select current location"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-ai-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {STADIUM_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="acc-dest" className="block text-xs text-slate-400 mb-1.5">
              <Navigation size={11} className="inline mr-1" aria-hidden="true" />Destination
            </label>
            <select
              id="acc-dest"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              aria-label="Select destination"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-ai-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-ai-600 hover:bg-ai-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
            aria-label="Generate accessible route with AI"
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />Finding Route…</>
              : <><Send size={14} aria-hidden="true" />Generate Accessible Route</>}
          </button>
        </form>

        <div className="lg:col-span-3 space-y-4">
          {/* ADA Quick Reference */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">ADA Quick Reference</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: '🛗', label: 'ADA Elevator 3', detail: 'Sector B — Lower to Upper Tier' },
                { icon: '🛗', label: 'ADA Elevator 4', detail: 'Sector C — Lower to Upper Tier' },
                { icon: '♿', label: 'ADA Ramp 1', detail: 'Main Plaza → Lower Concourse (1:12 slope)' },
                { icon: '🚌', label: 'Golf Cart Shuttle', detail: 'Lot P4 ↔ Light Rail Station ↔ Gate A' },
                { icon: '🔇', label: 'Quiet Room A-102', detail: 'Sensory-friendly, noise dampening' },
                { icon: '🔇', label: 'Quiet Room D-205', detail: 'Low-lighting, calming environment' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stadium-700/30 border border-stadium-500/20">
                  <span className="text-base" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-ai-400">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Response */}
          {response && !loading && (
            <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
          )}
          {loading && (
            <div className="glass-card p-5 text-center">
              <div className="w-8 h-8 border-2 border-ai-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-ai-400 font-medium">Mapping accessible route…</p>
              <p className="text-xs text-slate-500 mt-1">Grounding in accessibility_rules.json</p>
            </div>
          )}
        </div>
      </div>

      {/* Companion seating notice */}
      <div className="glass-card p-4 border border-ai-500/20 bg-ai-600/5 flex items-start gap-3">
        <span className="text-lg" aria-hidden="true">♿</span>
        <p className="text-xs text-slate-400">
          <span className="text-ai-400 font-semibold">ADA Companion Policy:</span> Each ADA visitor is entitled to 1 complimentary companion ticket. Accessible seating platforms (Sections 102, 114, 204, 228) include power outlets for motorized wheelchairs.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityGuardian;
