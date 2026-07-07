import React, { useState } from 'react';
import { Users, AlertTriangle, MapPin, Radio, Send } from 'lucide-react';
import { useAIRequest } from '../../hooks/useAIRequest';
import { useMatchContext } from '../../hooks/useMatchContext';
import AIResponseCard from '../shared/AIResponseCard';


const INCIDENT_TYPES = [
  'Crowd Surge / Congestion',
  'Lost Spectator / Minor',
  'Spill / Concourse Hazard',
  'Access Gate Scanner Failure',
  'Zero-Waste Contamination',
  'Medical Standby Required',
  'Ticketing Issue',
  'Unattended Item',
];

const LOCATIONS = [
  'Gate A ticket entrance', 'Gate B ticket entrance', 'Gate G main entrance',
  'Sector A seating bowl', 'Sector B seating bowl', 'Sector C seating bowl',
  'Concourse Level 1 plaza', 'Concourse Level 2 plaza', 'Food Plaza 3',
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

const QUICK_DISPATCH_CASES = [
  { label: '🚽 Restroom Queue Overflow', notes: 'Restroom queue overflow at Concourse Level 2. Blocking passenger exit pathways.' },
  { label: '📦 Unattended Backpack', notes: 'Unattended black backpack found near Gate G ticket queue line. No owner in sight.' },
  { label: '🧹 Liquid Spill Sector C', notes: 'Large water spill reported near Sector C concession corridor. Slippery hazard for guests.' }
];

const VolunteerCopilot: React.FC = () => {
  const { currentPhase } = useMatchContext();
  const { response, loading, elapsedMs, processQuery } = useAIRequest();
  
  const [incidentType, setIncidentType] = useState(INCIDENT_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('medium');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerDispatch(notes || `Incident report: ${incidentType} at ${location}`);
  };

  const triggerDispatch = async (detailNotes: string) => {
    const dispatchPrompt = `FIFA Volunteer Dispatch instructions for ${incidentType} at ${location}. Priority: ${priority.toUpperCase()}. Details: ${detailNotes}. Respond using the standard format: Situation, Priority, Immediate Action, and Escalation.`;
    await processQuery(dispatchPrompt, currentPhase);
  };

  const handleQuickCase = async (quickNotes: string) => {
    setNotes(quickNotes);
    await triggerDispatch(quickNotes);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-5 border border-sustain-500/20 glow-sustain">
        <div className="flex items-center gap-3 mb-1">
          <Users size={20} className="text-sustain-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">FIFA 2026 Volunteer Action Dispatch</h2>
        </div>
        <p className="text-slate-400 text-sm">FIFA World Cup 2026 · AI supervisor grounded in emergency manuals & volunteer logs</p>
      </div>

      {/* Quick Cases Ribbon */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Dispatch Simulation Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {QUICK_DISPATCH_CASES.map((c, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleQuickCase(c.notes)}
              className="p-3 text-left border border-stadium-750 bg-stadium-850/50 hover:border-sustain-500/30 hover:bg-sustain-500/5 rounded-xl cursor-pointer transition-all disabled:opacity-40"
            >
              <p className="text-xs font-bold text-slate-200">{c.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate">{c.notes}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-display">Report Incident details</h3>

          <div>
            <label htmlFor="vol-incident-type" className="block text-xs text-slate-400 mb-1">
              <AlertTriangle size={11} className="inline mr-1" aria-hidden="true" />Incident Type
            </label>
            <select
              id="vol-incident-type"
              value={incidentType}
              onChange={e => setIncidentType(e.target.value)}
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-sustain-500/60 focus:outline-none cursor-pointer"
            >
              {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="vol-location" className="block text-xs text-slate-400 mb-1">
              <MapPin size={11} className="inline mr-1" aria-hidden="true" />Location
            </label>
            <select
              id="vol-location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-sustain-500/60 focus:outline-none cursor-pointer"
            >
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1.5">
              <Radio size={11} className="inline mr-1" aria-hidden="true" />Priority Level
            </p>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Incident priority level">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={priority === p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    priority === p
                      ? 'border-sustain-500 bg-sustain-500/10 text-sustain-400 scale-[1.03] font-bold shadow'
                      : 'border-stadium-700 text-slate-500 hover:border-slate-650'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="vol-notes" className="block text-xs text-slate-400 mb-1">Additional Notes</label>
            <textarea
              id="vol-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Provide situational details for AI dispatch..."
              rows={2}
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-sustain-500/60 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-sustain-600 hover:bg-sustain-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Send size={13} aria-hidden="true" />
            {loading ? 'Consulting Manuals...' : 'Get AI Action Dispatch'}
          </button>
        </form>

        {/* Right Output Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Radio Reference */}
          <div className="glass-card p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <Radio size={12} className="inline mr-1" aria-hidden="true" />Radio Channel Directory
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-stadium-800/40 border border-stadium-700/50 flex justify-between">
                <span className="text-slate-400">CH 1: Ingress Ops</span>
                <span className="font-bold text-crowd-400">Active</span>
              </div>
              <div className="p-2 rounded-lg bg-stadium-800/40 border border-stadium-700/50 flex justify-between">
                <span className="text-slate-400">CH 2: Facility Spills</span>
                <span className="font-bold text-amber-400">Active</span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="glass-card p-5 text-center">
              <div className="w-8 h-8 border-2 border-sustain-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-xs text-sustain-400 font-bold">Consulting emergency protocols and dispatch codes...</p>
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

export default VolunteerCopilot;
