import React, { useState } from 'react';
import { MapPin, Globe, Accessibility, Bus, Wand2, ChevronRight } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import AIResponseCard from '../shared/AIResponseCard';

const LANGUAGES = ['English', 'Spanish', 'Japanese', 'French', 'Portuguese', 'Arabic', 'German', 'Korean', 'Mandarin'];
const TRANSPORT = ['Light Rail', 'Shuttle Bus', 'Ride-Share', 'Walking', 'Cycling', 'Taxi'];
const ACCESS_NEEDS = ['None', 'Wheelchair', 'Visual Assistance', 'Hearing Loop', 'Elderly Mobility Support', 'Sensory-Friendly'];

interface JourneyForm {
  seat: string;
  language: string;
  accessNeeds: string;
  transport: string;
}

const FanJourneyAI: React.FC = () => {
  const [form, setForm] = useState<JourneyForm>({
    seat: '',
    language: 'English',
    accessNeeds: 'None',
    transport: 'Light Rail',
  });
  const { response, loading, elapsedMs, processQuery } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = `Generate a personalized FIFA 2026 matchday journey plan for a fan. Seat: ${form.seat || 'General Admission'}. Language: ${form.language}. Accessibility needs: ${form.accessNeeds}. Transport mode: ${form.transport}. Include arrival gate, concourse route, recommended arrival time, amenities, and any accessibility accommodations needed.`;
    await processQuery(query);
  };

  const set = (key: keyof JourneyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-gold-500/20 glow-gold">
        <div className="flex items-center gap-3 mb-1">
          <MapPin size={20} className="text-gold-400" aria-hidden="true" />
          <h2 className="text-xl font-bold font-display text-gradient-gold">FanJourney AI — Personalized Matchday Planner</h2>
        </div>
        <p className="text-slate-400 text-sm">AI-powered journey plans grounded in real stadium knowledge</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card p-6 space-y-5" noValidate>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Fan Details</h3>

          <div>
            <label htmlFor="fan-seat" className="block text-xs text-slate-400 mb-1.5">
              <MapPin size={11} className="inline mr-1" aria-hidden="true" />Seat / Section
            </label>
            <input
              id="fan-seat"
              type="text"
              value={form.seat}
              onChange={set('seat')}
              placeholder="e.g. Sector B, Row 12, Seat 4"
              aria-label="Seat location"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-gold-500/60 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="fan-language" className="block text-xs text-slate-400 mb-1.5">
              <Globe size={11} className="inline mr-1" aria-hidden="true" />Preferred Language
            </label>
            <select
              id="fan-language"
              value={form.language}
              onChange={set('language')}
              aria-label="Preferred language"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-gold-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="fan-access" className="block text-xs text-slate-400 mb-1.5">
              <Accessibility size={11} className="inline mr-1" aria-hidden="true" />Accessibility Needs
            </label>
            <select
              id="fan-access"
              value={form.accessNeeds}
              onChange={set('accessNeeds')}
              aria-label="Accessibility needs"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-gold-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {ACCESS_NEEDS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="fan-transport" className="block text-xs text-slate-400 mb-1.5">
              <Bus size={11} className="inline mr-1" aria-hidden="true" />Transport Mode
            </label>
            <select
              id="fan-transport"
              value={form.transport}
              onChange={set('transport')}
              aria-label="Transport mode to stadium"
              className="w-full bg-stadium-800/60 border border-stadium-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-gold-500/60 focus:outline-none transition-colors cursor-pointer"
            >
              {TRANSPORT.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-stadium-900 transition-all cursor-pointer"
            aria-label="Generate AI matchday journey plan"
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-stadium-900 border-t-transparent rounded-full animate-spin" aria-hidden="true" />Generating Plan…</>
              : <><Wand2 size={16} aria-hidden="true" />Generate AI Journey Plan</>}
          </button>
        </form>

        {/* Right panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Journey steps preview */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Typical Journey Milestones</h3>
            <div className="space-y-3">
              {[
                { icon: '🚌', step: 'Transport Arrival', detail: `${form.transport} drop-off → ADA Gate / Gate A` },
                { icon: '🎫', step: 'Security & Ticketing', detail: 'Present digital ticket at assigned gate scanner' },
                { icon: '🗺️', step: 'Concourse Navigation', detail: `Route to ${form.seat || 'your section'} via accessible concourse` },
                { icon: '🍔', step: 'Pre-Match Amenities', detail: 'Food Courts 1–3 open 2hrs before kickoff' },
                { icon: '⚽', step: 'Match Kickoff', detail: '17:00 EST — Be in your seat by 16:45' },
              ].map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{m.icon}</span>
                  <div className="flex-1 border-l border-stadium-500/30 pl-3">
                    <p className="text-sm font-medium text-slate-300">{m.step}</p>
                    <p className="text-xs text-slate-500">{m.detail}</p>
                  </div>
                  {i < 4 && <ChevronRight size={14} className="text-slate-600 mt-1" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility tag */}
          {form.accessNeeds !== 'None' && (
            <div className="glass-card p-4 border border-ai-500/20 bg-ai-600/5">
              <p className="text-xs text-ai-400 font-semibold mb-1">♿ Accessibility Mode Active</p>
              <p className="text-xs text-slate-400">
                AI will prioritize ADA pathways, elevator access, and companion seating in the generated plan for: <strong className="text-ai-300">{form.accessNeeds}</strong>
              </p>
            </div>
          )}

          {/* AI Response */}
          {response && !loading && (
            <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
          )}

          {loading && (
            <div className="glass-card p-5 text-center">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-gold-400 font-medium">AI is personalizing your journey plan…</p>
              <p className="text-xs text-slate-500 mt-1">Grounding in stadium_sop.json & accessibility_rules.json</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FanJourneyAI;
