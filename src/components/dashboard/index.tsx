import React from 'react';
import { Shield, Users, AlertTriangle, Zap, Play } from 'lucide-react';
import { demoScenarios } from '../../data/fifaScenarios';
import { useMatchPhase } from '../../hooks/useMatchPhase';
import { usePersona } from '../../hooks/usePersona';
import { useStadiumMetrics } from '../../hooks/useStadiumMetrics';
import { useDemoScenario } from '../../hooks/useDemoScenario';

import MatchHeader from './MatchHeader';
import CrowdWidget from './CrowdWidget';
import TransportWidget from './TransportWidget';
import IncidentWidget from './IncidentWidget';
import VolunteerWidget from './VolunteerWidget';

import MetricCard from '../shared/MetricCard';
import StatusBadge from '../shared/StatusBadge';
import LoadingState from '../shared/LoadingState';
import AIResponseCard from '../shared/AIResponseCard';
import AIStatusPanel from '../shared/AIStatusPanel';

const CommandCenter: React.FC = () => {
  const { currentPhase, phaseInfo, setPhase, phases } = useMatchPhase();
  const { currentPersona, personaInfo, setPersona, personas } = usePersona();
  const { attendance, volunteersCount, gateData, crowdData } = useStadiumMetrics();
  const { activeScenario, loading, response, elapsedMs, triggerScenario } = useDemoScenario();

  return (
    <div className="space-y-6">
      {/* Header Widget */}
      <MatchHeader
        currentPhase={currentPhase}
        phaseInfo={phaseInfo}
        setPhase={setPhase}
        phases={phases}
        currentPersona={currentPersona}
        personaInfo={personaInfo}
        setPersona={setPersona}
        personas={personas}
        attendance={attendance}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Spectator Load"
          value="92%"
          icon={<Users size={18} />}
          subtext="Gate G Load Critical"
          trend="increasing"
          borderColor="border-red-500/30"
          textColor="text-red-400"
        />
        <MetricCard
          title="Active Scanners"
          value="6 / 8"
          icon={<Shield size={18} />}
          subtext="2 at peak capacity"
          trend="stable"
          borderColor="border-crowd-500/30"
          textColor="text-crowd-400"
        />
        <MetricCard
          title="Active FIFA Incidents"
          value="4"
          icon={<AlertTriangle size={18} />}
          subtext="1 critical hazard"
          trend="increasing"
          borderColor="border-orange-500/30"
          textColor="text-orange-400"
        />
        <MetricCard
          title="Mobilized Volunteers"
          value={volunteersCount.toString()}
          icon={<Zap size={18} />}
          subtext="across 12 sectors"
          trend="stable"
          borderColor="border-sustain-500/30"
          textColor="text-sustain-400"
        />
      </div>

      {/* Charts / Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CrowdWidget crowdData={crowdData} />
        <TransportWidget gateData={gateData} />
      </div>

      {/* Incidents + Status row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <IncidentWidget />
        </div>
        <AIStatusPanel />
      </div>

      {/* Judge Demo Console */}
      <div className="glass-card p-5 border border-ai-500/20 glow-ai">
        <div className="flex items-center gap-2 mb-4">
          <Play size={16} className="text-ai-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-350 uppercase tracking-widest font-display">
            FIFA 2026 Simulation Operations Twin
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Click a matchday scenario below to orchestrate the RAG + Gemini pipeline under the active persona & phase context:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {demoScenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => triggerScenario(scenario, currentPhase)}
              disabled={loading}
              aria-label={`Run demo scenario: ${scenario.title}`}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                activeScenario?.id === scenario.id
                  ? 'border-ai-500/60 bg-ai-600/20 scale-[0.98]'
                  : 'border-stadium-750 bg-stadium-850/40 hover:border-ai-500/40 hover:bg-ai-600/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-xl mb-1 block" aria-hidden="true">
                {scenario.type === 'surge' ? '🚨' : scenario.type === 'lost-fan' ? '🧭' : scenario.type === 'accessibility' ? '♿' : scenario.type === 'maintenance' ? '🔧' : '♻️'}
              </span>
              <p className="text-xs font-bold text-slate-300 leading-tight">{scenario.title}</p>
              <div className="mt-1.5">
                <StatusBadge status={scenario.severity} />
              </div>
            </button>
          ))}
        </div>

        {/* Loading state wrapper */}
        {loading && (
          <LoadingState type="ai" message="Orchestrating RAG context & running Gemini operations planner..." />
        )}

        {/* Response display */}
        {response && !loading && (
          <div className="space-y-4">
            <AIResponseCard response={response} elapsedMs={elapsedMs} ragEnabled />
            
            {/* Explainability checklist */}
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
  );
};

export default CommandCenter;
export { MatchHeader, CrowdWidget, TransportWidget, IncidentWidget, VolunteerWidget };
