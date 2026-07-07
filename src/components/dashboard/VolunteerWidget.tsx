import React from 'react';
import { Radio, ShieldAlert } from 'lucide-react';
import { RADIO_CHANNELS } from '../../constants/stadiumConfig';

interface VolunteerWidgetProps {
  volunteersCount: number;
}

const VolunteerWidget: React.FC<VolunteerWidgetProps> = ({ volunteersCount }) => {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-stadium-800 pb-2">
        <Radio size={16} className="text-sustain-400" />
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Field Logistics</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Volunteer counts */}
        <div className="p-3 bg-stadium-900/30 border border-stadium-800/40 rounded-xl flex items-center justify-between col-span-1">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">SOP Staff In Field</span>
            <span className="text-xl font-bold text-slate-200">{volunteersCount} Amb.</span>
          </div>
          <ShieldAlert size={20} className="text-sustain-450" />
        </div>

        {/* Radio Channel Directory */}
        <div className="sm:col-span-2 p-3 bg-stadium-900/30 border border-stadium-800/40 rounded-xl space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Active Radio Channels</span>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {RADIO_CHANNELS.map(c => (
              <div key={c.ch} className="flex justify-between items-center bg-stadium-850/50 p-1.5 rounded border border-stadium-750/30">
                <span className="text-slate-400">{c.ch}: {c.label}</span>
                <span className="font-bold text-emerald-450 text-[9px] uppercase">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerWidget;
