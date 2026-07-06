import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Incident {
  id: string;
  type: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  time: string;
}

const incidents: Incident[] = [
  { id: 'INC-001', type: 'Crowd Surge', location: 'Gate G', priority: 'critical', time: '16:28' },
  { id: 'INC-002', type: 'Medical Assist', location: 'Sector B Row 14', priority: 'high', time: '16:15' },
  { id: 'INC-003', type: 'ADA Request', location: 'Light Rail Gate', priority: 'medium', time: '15:58' },
  { id: 'INC-004', type: 'Spill/Hazard', location: 'Corridor C-3', priority: 'high', time: '15:42' },
];

const priorityColors: Record<Incident['priority'], string> = {
  critical: 'text-red-400 border-red-500/40 bg-red-500/10',
  high:     'text-orange-400 border-orange-500/40 bg-orange-500/10',
  medium:   'text-amber-400 border-amber-500/40 bg-amber-500/10',
  low:      'text-slate-400 border-slate-500/40 bg-slate-500/10',
};

const IncidentLog: React.FC = () => {
  return (
    <div className="glass-card p-5 lg:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-orange-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-300">Live Incident Log</h3>
      </div>
      <div className="space-y-2" role="list" aria-label="Active incidents">
        {incidents.map(inc => (
          <div key={inc.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${priorityColors[inc.priority]}`} role="listitem">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">{inc.id}</span>
              <span className="text-sm font-medium">{inc.type}</span>
              <span className="text-xs text-slate-500">@ {inc.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${priorityColors[inc.priority]}`}>
                {inc.priority}
              </span>
              <span className="text-xs text-slate-500">{inc.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentLog;
