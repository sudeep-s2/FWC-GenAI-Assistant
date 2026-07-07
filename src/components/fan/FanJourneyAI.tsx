import React, { useState } from 'react';
import { MapPin, Globe, Accessibility, Bus, Wand2 } from 'lucide-react';
import { useAIRequest } from '../../hooks/useAIRequest';
import { useMatchContext } from '../../hooks/useMatchContext';
import AIResponseCard from '../shared/AIResponseCard';

const LANGUAGES = ['English', 'Spanish', 'French', 'Japanese', 'Arabic'];
const TRANSPORT = ['Light Rail', 'Shuttle Bus', 'Ride-Share', 'Walking', 'Taxi'];
const ACCESS_NEEDS = ['None', 'Wheelchair', 'Visual Assistance', 'Hearing Loop', 'Elderly Mobility Support'];

interface JourneyForm {
  seat: string;
  language: string;
  accessNeeds: string;
  transport: string;
}

const PRESET_PROFILES = [
  {
    label: '✈️ Airport Arrival',
    desc: 'Intl fan arriving at Airport transit hub',
    form: { seat: 'Sector A, Row 5, Seat 2 (VIP)', language: 'French', accessNeeds: 'None', transport: 'Light Rail' }
  },
  {
    label: '👨‍👩‍👧 Family with Kids',
    desc: 'Family requiring wide concessions and restrooms',
    form: { seat: 'Sector C, Row 15, Seat 8', language: 'English', accessNeeds: 'None', transport: 'Shuttle Bus' }
  },
  {
    label: '♿ Disabled Guest',
    desc: 'Wheelchair user needing lift priority and companion routes',
    form: { seat: 'Sector C Section 104 Platform', language: 'Spanish', accessNeeds: 'Wheelchair', transport: 'Ride-Share' }
  },
  {
    label: '🏃 Late Arriving Fan',
    desc: 'Arriving post-kickoff; needs fast-track entry gates',
    form: { seat: 'Sector B, Row 8, Seat 1', language: 'Arabic', accessNeeds: 'None', transport: 'Walking' }
  }
];

const FanJourneyAI: React.FC = () => {
  const { currentPhase } = useMatchContext();
  const { response, loading, elapsedMs, processQuery } = useAIRequest();
  
  const [form, setForm] = useState<JourneyForm>({
    seat: '',
    language: 'English',
    accessNeeds: 'None',
    transport: 'Light Rail',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerPlan(form);
  };

  const triggerPlan = async (f: JourneyForm) => {
    const query = `Generate personalized FIFA 2026 matchday plan. Profile details - Seat: ${f.seat || 'General Admission'}, Preferred Lang: ${f.language}, Accessibility: ${f.accessNeeds}, Transport: ${f.transport}. Respond in ${f.language}.`;
    await processQuery(query, currentPhase);
  };

  const handlePreset = async (preset: typeof PRESET_PROFILES[0]) => {
    setForm(preset.form);
    await triggerPlan(preset.form);
  };

  const set = (key: keyof JourneyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-5 border border-gold-500/20 glow-gold">
        <div className="flex items-center gap-3 mb-1">
          <MapPin size={20} className="text-gold-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-gold">FanJourney AI — Personalized Matchday Planner</h2>
        </div>
        <p className="text-slate-400 text-sm">FIFA World Cup 2026 · Personal multi-lingual journey routing for global spectators</p>
      </div>

      {/* Preset Profiles Ribbon */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Spectator Preset Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PROFILES.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handlePreset(p)}
              className="p-3 text-left border border-stadium-750 bg-stadium-850/50 hover:border-gold-500/30 hover:bg-gold-500/5 rounded-xl cursor-pointer transition-all disabled:opacity-40"
            >
              <p className="text-xs font-bold text-slate-200">{p.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form Panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Matchday Parameters</h3>

          <div>
            <label htmlFor="fan-seat" className="block text-xs text-slate-400 mb-1.5">
              <MapPin size={11} className="inline mr-1" aria-hidden="true" />Seat / Section Details
            </label>
            <input
              id="fan-seat"
              type="text"
              value={form.seat}
              onChange={set('seat')}
              placeholder="e.g. Sector B, Row 12, Seat 4"
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:border-gold-500/60 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fan-language" className="block text-xs text-slate-400 mb-1.5">
                <Globe size={11} className="inline mr-1" aria-hidden="true" />Language
              </label>
              <select
                id="fan-language"
                value={form.language}
                onChange={set('language')}
                className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-gold-500/60 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="fan-transport" className="block text-xs text-slate-400 mb-1.5">
                <Bus size={11} className="inline mr-1" aria-hidden="true" />Transport
              </label>
              <select
                id="fan-transport"
                value={form.transport}
                onChange={set('transport')}
                className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-gold-500/60 focus:outline-none cursor-pointer"
              >
                {TRANSPORT.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="fan-access" className="block text-xs text-slate-400 mb-1.5">
              <Accessibility size={11} className="inline mr-1" aria-hidden="true" />ADA Accommodation
            </label>
            <select
              id="fan-access"
              value={form.accessNeeds}
              onChange={set('accessNeeds')}
              className="w-full bg-stadium-800 border border-stadium-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-gold-500/60 focus:outline-none cursor-pointer"
            >
              {ACCESS_NEEDS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-stadium-950 transition-all cursor-pointer"
          >
            <Wand2 size={13} aria-hidden="true" />
            {loading ? 'Compiling FIFA Plan...' : 'Generate AI Matchday Plan'}
          </button>
        </form>

        {/* Right Output Panel */}
        <div className="lg:col-span-3 space-y-4">
          {loading && (
            <div className="glass-card p-5 text-center">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-xs text-gold-400 font-bold">AI is personalizing travel directions and translation cards…</p>
              <p className="text-[10px] text-slate-500 mt-1">Sourcing rules from accessibility_rules.json and stadium_sop.json</p>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-4">
              <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
              
              {/* Explainability Section */}
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

          {!response && !loading && (
            <div className="glass-card p-5 text-center text-slate-500 text-xs">
              Fill in the parameters or select a preset spectator profile above to compile your personalized FIFA World Cup matchday journey instructions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FanJourneyAI;
