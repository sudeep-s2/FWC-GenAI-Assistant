import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import InfoTooltip from '../shared/InfoTooltip';
import EmptyState from '../shared/EmptyState';
import { PRIORITY_COLORS } from '../../constants/stadiumConfig';

interface Incident {
  id: string;
  type: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  time: string;
}

const initialIncidents: Incident[] = [
  { id: 'INC-001', type: 'Crowd Surge', location: 'Gate G Outer Perimeter', priority: 'critical', time: '16:28' },
  { id: 'INC-002', type: 'Medical Assist', location: 'Sector B Row 14', priority: 'high', time: '16:15' },
  { id: 'INC-003', type: 'ADA Lift Request', location: 'Light Rail Gate', priority: 'medium', time: '15:58' },
  { id: 'INC-004', type: 'Concourse Spill', location: 'Corridor C-3', priority: 'high', time: '15:42' },
];

const IncidentWidget: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const handleResolveAll = () => setIncidents([]);
  const handleReset = () => setIncidents(initialIncidents);

  return (
    <div className="glass-card p-5 flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-stadium-800 pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-400" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Live Incident Log</h3>
            <InfoTooltip content="Displays active stadium issues that need operational resolution or safety redirects." />
          </div>
          {incidents.length > 0 ? (
            <button
              onClick={handleResolveAll}
              className="text-[10px] text-emerald-450 hover:text-emerald-400 font-bold border border-emerald-500/30 px-2 py-0.5 rounded-lg bg-emerald-500/5 cursor-pointer"
            >
              Resolve All
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="text-[10px] text-gold-450 hover:text-gold-400 font-bold border border-gold-500/30 px-2 py-0.5 rounded-lg bg-gold-500/5 cursor-pointer"
            >
              Reload Incidents
            </button>
          )}
        </div>

        {incidents.length > 0 ? (
          <div className="space-y-2" role="list" aria-label="Active incidents list">
            {incidents.map(inc => (
              <div 
                key={inc.id} 
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg border ${PRIORITY_COLORS[inc.priority] || 'border-stadium-700'}`} 
                role="listitem"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-slate-500">{inc.id}</span>
                  <span className="font-semibold text-slate-200">{inc.type}</span>
                  <span className="text-slate-400">@ {inc.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] font-bold uppercase border px-1.5 py-0.2 rounded">
                    {inc.priority}
                  </span>
                  <span className="text-[10px] text-slate-500">{inc.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="All clear! No stadium incidents detected"
            description="All ticketing scanners, accessible ramps, and concourse plazas are operating normally."
            icon={<ShieldCheck size={28} className="text-emerald-500 mb-2 animate-pulse" />}
          />
        )}
      </div>
    </div>
  );
};

export default IncidentWidget;
