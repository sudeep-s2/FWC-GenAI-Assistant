import React from 'react';
import { History, ArrowDown, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: 'alert' | 'recommendation' | 'action' | 'outcome';
}

const TIMELINES: Record<string, TimelineEvent[]> = {
  'scen-surge-emergency': [
    { time: '09:10', title: 'Crowd Surge Detected', description: 'Sensor nodes detect Gate G density exceeding 4.5 people/m² (92% load).', type: 'alert' },
    { time: '09:11', title: 'AI Recommendation Issued', description: 'AI suggests throttling scanners to 50% capacity and activating detours to Gates F and H.', type: 'recommendation' },
    { time: '09:12', title: 'Action Dispatched', description: 'Volunteers deploy serpentine barriers; digital signage redirects incoming crowd.', type: 'action' },
    { time: '09:14', title: 'Mitigation Achieved', description: 'Entry flow balances successfully. Gate G local density reduced by 23%.', type: 'outcome' },
  ],
  'scen-lost-fan': [
    { time: '10:15', title: 'Multilingual Assistance Alert', description: 'Lost Japanese-speaking spectator arrives at Concourse Info Point 2.', type: 'alert' },
    { time: '10:16', title: 'AI Translation & Route Plan', description: 'AI translates ticket data, details Sector B Section 112 routing, and checks bilingual logs.', type: 'recommendation' },
    { time: '10:17', title: 'Escort Dispatched', description: 'Japanese-speaking Ambassador dispatched to escort fan to seating block.', type: 'action' },
    { time: '10:22', title: 'Spectator Escorted', description: 'Spectator safely seated. Ticket assistance log verified and closed.', type: 'outcome' },
  ],
  'scen-accessibility-request': [
    { time: '14:30', title: 'ADA Transit Request', description: 'Elderly visitor with companion registered at Light Rail Transit ADA gate.', type: 'alert' },
    { time: '14:31', title: 'AI Accessible Route Plan', description: 'AI identifies low-slope ADA Ramp 1, priority Elevator 4, and shuttle cart coordinates.', type: 'recommendation' },
    { time: '14:32', title: 'ADA Shuttle Dispatched', description: 'Golf cart shuttle dispatched to Light Rail gate; priority elevator cleared of queues.', type: 'action' },
    { time: '14:40', title: 'ADA Escort Complete', description: 'Visitor safely reaches Sector C Section 104 companion platforms.', type: 'outcome' },
  ],
  'scen-maintenance-incident': [
    { time: '18:05', title: 'Liquid Spill Reported', description: 'Large slippery water spill reported at Concourse Corridor C-3.', type: 'alert' },
    { time: '18:06', title: 'AI Risk Escalation', description: 'AI flags spill as high risk due to blockage of primary ADA wheelchair corridor.', type: 'recommendation' },
    { time: '18:07', title: 'Maintenance Dispatched', description: 'Facilities team dispatched with wet vacs and caution cones. Ushers divert wheelchair users.', type: 'action' },
    { time: '18:12', title: 'Hazard Cleared', description: 'Spill fully cleaned. Corridor C-3 corridor reopened for general traffic.', type: 'outcome' },
  ],
  'scen-sustainability-optimization': [
    { time: '11:45', title: 'Recycling Contamination Flagged', description: 'Optical waste analysis flags 62% plastic contamination at Food Plaza 3 bin lines.', type: 'alert' },
    { time: '11:46', title: 'AI Sustainability Plan', description: 'AI recommends posting eco volunteers at bin bays and loading zero-waste graphics on LEDs.', type: 'recommendation' },
    { time: '11:47', title: 'Ambassadors Dispatched', description: 'Two volunteers deployed to act as sorting guides; LED screen loops recycling SOP graphics.', type: 'action' },
    { time: '11:58', title: 'Sorting Compliance Rise', description: 'Waste contamination drops from 62% to 12% (84% Dual-compost compliance achieved).', type: 'outcome' },
  ],
  'general': [
    { time: '08:00', title: 'Shift Supervisor Check-in', description: 'FIFA Matchday operations shift begins. Radio channels 1-4 online.', type: 'alert' },
    { time: '08:05', title: 'System Self-Check Success', description: 'StadiumOS database and local RAG indexes validated. Gemini connectivity active.', type: 'recommendation' },
    { time: '08:10', title: 'Scanner Diagnostics OK', description: 'Automatic security gate scanner connections verified across 8 perimeter sectors.', type: 'outcome' },
  ]
};

interface IncidentTimelineProps {
  activeScenarioId?: string | null;
}

const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ activeScenarioId }) => {
  const events = TIMELINES[activeScenarioId || 'general'] || TIMELINES['general'];
  const titleText = activeScenarioId 
    ? `Incident History: ${activeScenarioId.replace('scen-', '').replace('-', ' ').toUpperCase()}`
    : 'Default Shift Log (Baseline)';

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'alert': return <ShieldAlert className="text-red-400 shrink-0" size={16} />;
      case 'recommendation': return <Sparkles className="text-violet-400 shrink-0" size={16} />;
      case 'action': return <ArrowDown className="text-amber-400 shrink-0" size={16} />;
      case 'outcome': return <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />;
    }
  };

  const getBorderColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'alert': return 'border-red-500/30 bg-red-500/5';
      case 'recommendation': return 'border-violet-500/30 bg-violet-500/5';
      case 'action': return 'border-amber-500/30 bg-amber-500/5';
      case 'outcome': return 'border-emerald-500/30 bg-emerald-500/5';
    }
  };

  return (
    <div className="glass-card p-5 border border-stadium-750 flex flex-col space-y-4">
      <div className="flex items-center gap-2 border-b border-stadium-850 pb-3">
        <History className="text-gold-450" size={18} aria-hidden="true" />
        <div>
          <h3 className="text-sm font-bold text-slate-200 font-display">Decision Support Timeline</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Chronological incident response tracking and audit trails</p>
        </div>
      </div>

      <p className="text-[11px] font-bold text-gold-400 uppercase tracking-widest bg-gold-500/5 px-2.5 py-1.5 rounded-lg border border-gold-500/10">
        {titleText}
      </p>

      {/* Events List */}
      <div className="relative space-y-4 pl-3" role="log" aria-label="Incident response events">
        {/* Continuous timeline line */}
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-stadium-800" aria-hidden="true" />

        {events.map((ev, idx) => (
          <div key={idx} className="relative flex gap-4 items-start">
            {/* Timestamp Badge */}
            <span className="text-[10px] font-mono font-bold text-slate-500 w-10 mt-1 shrink-0 text-right">
              {ev.time}
            </span>

            {/* Bullet point with icon */}
            <div className={`p-2 rounded-full border bg-stadium-950 border-stadium-700 z-10 shrink-0`}>
              {getEventIcon(ev.type)}
            </div>

            {/* Event Description Card */}
            <div className={`flex-1 p-3.5 rounded-xl border ${getBorderColor(ev.type)} space-y-1`}>
              <h4 className="text-xs font-bold text-slate-200">{ev.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTimeline;
