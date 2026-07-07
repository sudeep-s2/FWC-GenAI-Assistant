import React from 'react';
import type { MatchPhase, Persona } from '../../types';
import type { MatchPhaseInfo } from '../../hooks/useMatchPhase';
import type { PersonaInfo } from '../../hooks/usePersona';

interface MatchHeaderProps {
  currentPhase: MatchPhase;
  phaseInfo: MatchPhaseInfo;
  setPhase: (phase: MatchPhase) => void;
  phases: MatchPhaseInfo[];
  currentPersona: Persona;
  personaInfo: PersonaInfo;
  setPersona: (persona: Persona) => void;
  personas: PersonaInfo[];
  attendance: number;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  currentPhase,
  phaseInfo,
  setPhase,
  phases,
  currentPersona,
  personaInfo,
  setPersona,
  personas,
  attendance
}) => {
  return (
    <div className="glass-card p-5 border border-gold-500/20 glow-gold">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-display text-gradient-gold mb-1">
            FIFA World Cup 2026 Real-Time Operations Intelligence System
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-semibold">
            Matchday Operations command panel • Brazil vs Germany
          </p>
        </div>

        {/* System Settings (Persona & Phase Engine selectors) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Persona Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role:</span>
            <select
              value={currentPersona}
              onChange={(e) => setPersona(e.target.value as Persona)}
              className="px-2.5 py-1.5 bg-stadium-800 border border-stadium-700/60 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Phase selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Phase:</span>
            <select
              value={currentPhase}
              onChange={(e) => setPhase(e.target.value as MatchPhase)}
              className="px-2.5 py-1.5 bg-stadium-800 border border-stadium-700/60 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
            >
              {phases.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 border-l border-stadium-700 pl-4 text-xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Attendance</span>
              <span className="font-bold text-gold-450">{attendance.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-450 live-dot" aria-hidden="true" />
              <span className="text-[10px] font-bold text-emerald-450 uppercase tracking-widest">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role and Phase Context Summary */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stadium-800/60 text-xs text-slate-405">
        <div className="p-2 bg-stadium-900/40 rounded-xl border border-stadium-800/50">
          <span className="font-bold text-gold-450 uppercase tracking-wider block mb-0.5">Role Focus Areas:</span>
          {personaInfo.focus} • <span className="text-slate-500">{personaInfo.description}</span>
        </div>
        <div className="p-2 bg-stadium-900/40 rounded-xl border border-stadium-800/50">
          <span className="font-bold text-crowd-450 uppercase tracking-wider block mb-0.5">Phase AI Objective:</span>
          {phaseInfo.focusArea} • <span className="text-slate-500">{phaseInfo.description}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;
