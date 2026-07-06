import React, { useState } from 'react';
import { Users, AlertTriangle, MapPin, Radio, Send } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import AIResponseCard from '../shared/AIResponseCard';

const INCIDENT_TYPES = [
  'Crowd Surge / Congestion',
  'Lost Fan / Unaccompanied Minor',
  'Spill / Hazard',
  'Equipment Failure',
  'Aggressive Behavior',
  'Medical Assistance Required',
  'Ticket Issue',
  'Other',
];

const LOCATIONS = [
  'Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate G',
  'Sector A', 'Sector B', 'Sector C', 'Sector D',
  'Concourse Level 1', 'Concourse Level 2',
  'Food Court 1', 'Food Court 2', 'Food Court 3',
  'Guest Services Suite', 'First Aid Station',
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

const VolunteerCopilot: React.FC = () => {
  const [incidentType, setIncidentType] = useState(INCIDENT_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('medium');
  const [notes, setNotes] = useState('');
  const { response, loading, elapsedMs, processQuery } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = `Volunteer copilot request: Incident type "${incidentType}" at location "${location}", priority "${priority}". ${notes ? `Additional notes: ${notes}` : ''}. Provide step-by-step guidance for the volunteer, including who to contact, what actions to take, and relevant safety protocols.`;
    await processQuery(query);
  };

  const priorityColors: Record<string, string> = {
    low: 'border-slate-500/50 text-slate-400',
    medium: 'border-amber-500/50 text-amber-400',
    high: 'border-orange-500/50 text-orange-400',
    critical: 'border-red-500/50 text-red-400',
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-sustain-500/20 glow-sustain">
        <div className="flex items-center gap-3 mb-1">
          <Users size={20} className="text-sustain-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-ai">Volunteer Copilot — RAG-Powered Guidance</h2>
        </div>
        <p className="text-slate-400 text-sm">AI assistant grounded in volunteer_manual.json & emergency_protocols.json</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-6 space-y-5" noValidate aria-label="Volunteer incident report form">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Report Incident</h3>

          <div>
            <label htmlFor="vol-incident-type" className="block text-xs text-slate-400 mb-1.5">
              <AlertTriangle size={11} className="inline mr-1" aria-hidden="true" />Incident Type
            </label>
            <select
              id="vol-incident-type"
              value={incidentType}
              onChange={e => setIncidentType(e.target.value)}
              aria-label="Select incident type"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-sustain-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="vol-location" className="block text-xs text-slate-400 mb-1.5">
              <MapPin size={11} className="inline mr-1" aria-hidden="true" />Location
            </label>
            <select
              id="vol-location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              aria-label="Select incident location"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-sustain-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-2">
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
                  className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                    priority === p
                      ? `${priorityColors[p]} bg-white/5 scale-105`
                      : 'border-stadium-500/30 text-slate-600 hover:border-stadium-400/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="vol-notes" className="block text-xs text-slate-400 mb-1.5">Additional Notes</label>
            <textarea
              id="vol-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe what you see…"
              rows={3}
              aria-label="Additional incident details"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-sustain-500/60 focus:outline-none resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-sustain-600 hover:bg-sustain-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
            aria-label="Get AI guidance for this incident"
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />Getting Guidance…</>
              : <><Send size={14} aria-hidden="true" />Get AI Guidance</>}
          </button>
        </form>

        <div className="lg:col-span-3 space-y-4">
          {/* Radio Channels Reference */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              <Radio size={12} className="inline mr-1" aria-hidden="true" />Radio Channel Quick Reference
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { ch: 'CH 1', label: 'General Operations', color: 'text-crowd-400' },
                { ch: 'CH 2', label: 'Facilities & Spills', color: 'text-amber-400' },
                { ch: 'CH 3', label: 'Medical Dispatch', color: 'text-red-400' },
                { ch: 'CH 4', label: 'Security Escalation', color: 'text-orange-400' },
              ].map(c => (
                <div key={c.ch} className={`flex items-center gap-2 p-2.5 rounded-lg bg-stadium-700/40 border border-stadium-500/20`}>
                  <span className={`text-sm font-bold ${c.color}`}>{c.ch}</span>
                  <span className="text-xs text-slate-400">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active tasks */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Your Active Tasks</h3>
            <div className="space-y-2" role="list" aria-label="Active volunteer tasks">
              {[
                { task: 'Gate G barrier deployment', status: 'IN PROGRESS', color: 'text-amber-400' },
                { task: 'Sector B queue management', status: 'ASSIGNED', color: 'text-crowd-400' },
                { task: 'Translation assist – Gate D', status: 'PENDING', color: 'text-slate-400' },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-stadium-700/30 border border-stadium-500/20" role="listitem">
                  <span className="text-slate-300">{t.task}</span>
                  <span className={`font-semibold ${t.color}`}>{t.status}</span>
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
              <div className="w-8 h-8 border-2 border-sustain-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-sustain-400 font-medium">Consulting volunteer protocols…</p>
              <p className="text-xs text-slate-500 mt-1">RAG retrieving from volunteer_manual.json & emergency_protocols.json</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerCopilot;
