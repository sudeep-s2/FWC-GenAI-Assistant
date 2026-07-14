import React, { useState } from 'react';
import { Shield, Users, Heart, UsersRound, LogOut, Sparkles } from 'lucide-react';

export interface ZoneMetadata {
  id: string;
  name: string;
  occupancy: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  securityLevel: string;
  medicalUnits: string;
  volunteers: string;
  nearestExit: string;
  description: string;
  x: number;
  y: number;
  type: 'gate' | 'sector' | 'elevator' | 'transit';
}

const ZONE_DATA: ZoneMetadata[] = [
  {
    id: 'gate-g',
    name: 'Gate G Ingress (East)',
    occupancy: '92%',
    risk: 'critical',
    securityLevel: 'Level 3 (High Alert)',
    medicalUnits: '1 Medical Standby Team',
    volunteers: '6 Ushers, 2 Supervisors',
    nearestExit: 'Muster Point North (Zone 1)',
    description: 'Primary transit drop-off entry point. High density of fans and scanner bottleneck warning.',
    x: 320,
    y: 150,
    type: 'gate',
  },
  {
    id: 'gate-a',
    name: 'Gate A Entry (West)',
    occupancy: '45%',
    risk: 'low',
    securityLevel: 'Level 1 (Standard)',
    medicalUnits: 'None',
    volunteers: '4 Ushers',
    nearestExit: 'Muster Point West',
    description: 'Steady ingress flow. Recommended for redirection detours to balance gate pressure.',
    x: 80,
    y: 150,
    type: 'gate',
  },
  {
    id: 'sector-c',
    name: 'Sector C Plaza (South)',
    occupancy: '80%',
    risk: 'medium',
    securityLevel: 'Level 2 (Active)',
    medicalUnits: 'First Aid Station Sector C (Room 12)',
    volunteers: '10 Volunteers, 2 Eco Monitors',
    nearestExit: 'Muster Point South (Zone 2)',
    description: 'Main Concourse Food Plaza. High queue times reported at zero-waste sorting bins.',
    x: 200,
    y: 250,
    type: 'sector',
  },
  {
    id: 'elevator-4',
    name: 'ADA Elevator 4 Lobby',
    occupancy: '65%',
    risk: 'medium',
    securityLevel: 'Level 1 (Standard)',
    medicalUnits: 'None',
    volunteers: '2 ADA Escort Ushers',
    nearestExit: 'Elevator Priority Exit',
    description: 'Dedicated priority elevator corridor. Heavily utilized by wheelchair/mobility guest lists.',
    x: 200,
    y: 50,
    type: 'elevator',
  },
  {
    id: 'transit-hub',
    name: 'Metro Transit Hub',
    occupancy: '88%',
    risk: 'high',
    securityLevel: 'Level 2 (Transit Police)',
    medicalUnits: '1 Mobile EMS Cart',
    volunteers: '8 Transit Guides, 4 Crowd Pulsers',
    nearestExit: 'Muster Point East (Zone 3)',
    description: 'External rail and shuttle platform. Heavy drop-off rates pushing incoming queues.',
    x: 360,
    y: 240,
    type: 'transit',
  },
];

interface InteractiveStadiumMapProps {
  onConsultAI: (query: string) => void;
  isLoading?: boolean;
}

const InteractiveStadiumMap: React.FC<InteractiveStadiumMapProps> = ({ onConsultAI, isLoading = false }) => {
  const [selectedZone, setSelectedZone] = useState<ZoneMetadata | null>(ZONE_DATA[0]);

  const handleZoneClick = (zone: ZoneMetadata) => {
    setSelectedZone(zone);
  };

  const handleConsultAI = () => {
    if (!selectedZone) return;
    const query = `Analyze current status for ${selectedZone.name}. Telemetry parameters: Occupancy: ${selectedZone.occupancy}, Crowd Risk Level: ${selectedZone.risk.toUpperCase()}, Security Status: ${selectedZone.securityLevel}, Medical Deployment: ${selectedZone.medicalUnits}, Volunteer Count: ${selectedZone.volunteers}, Nearest Evac Route: ${selectedZone.nearestExit}. Provide standard operating recommendations.`;
    onConsultAI(query);
  };

  const getRiskColor = (risk: ZoneMetadata['risk']) => {
    switch (risk) {
      case 'critical': return 'fill-red-500 stroke-red-400';
      case 'high': return 'fill-orange-500 stroke-orange-400';
      case 'medium': return 'fill-amber-500 stroke-amber-400';
      case 'low': return 'fill-emerald-500 stroke-emerald-450';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-stadium-900/40 rounded-2xl border border-stadium-750 p-5">
      {/* SVG Interactive Map Column */}
      <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 font-display flex items-center gap-2">
            <Sparkles size={16} className="text-gold-450" />
            FIFA Stadium Digital Twin Map
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Select a highlighted zone on the twin grid to inspect real-time sensor parameters
          </p>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="relative flex justify-center items-center bg-stadium-950/60 rounded-xl p-6 border border-stadium-850/50">
          <svg
            viewBox="0 0 400 300"
            className="w-full max-w-lg aspect-[4/3] drop-shadow-2xl"
            aria-label="Stadium interactive diagram showing sensor zones"
          >
            {/* Outer Perimeter */}
            <circle cx="200" cy="150" r="130" className="fill-none stroke-stadium-700/60 stroke-2" />
            <circle cx="200" cy="150" r="110" className="fill-none stroke-stadium-750/30 stroke-dashed" />
            
            {/* Inner Seating Bowl Outline */}
            <ellipse cx="200" cy="150" rx="80" ry="60" className="fill-stadium-900/80 stroke-stadium-700/80 stroke-2" />
            
            {/* Central Playing Field */}
            <rect x="150" y="115" width="100" height="70" rx="4" className="fill-emerald-800/10 stroke-emerald-600/25 stroke-2" />
            <line x1="200" y1="115" x2="200" y2="185" className="stroke-emerald-600/20" />
            <circle cx="200" cy="150" r="15" className="fill-none stroke-emerald-600/20" />

            {/* Render Interactive Zones */}
            {ZONE_DATA.map(zone => {
              const isActive = selectedZone?.id === zone.id;
              const ringColor = getRiskColor(zone.risk);
              
              return (
                <g 
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className="cursor-pointer group"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleZoneClick(zone); }}
                  aria-label={`${zone.name}, risk level is ${zone.risk}`}
                >
                  {/* Outer pulsating indicator when selected */}
                  {isActive && (
                    <circle
                      cx={zone.x}
                      cy={zone.y}
                      r={14}
                      className="fill-none stroke-gold-450 stroke-2 animate-ping"
                    />
                  )}
                  {/* Hover ring */}
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={12}
                    className="fill-none stroke-white/0 group-hover:stroke-white/40 group-focus-visible:stroke-gold-400 transition-all stroke-2"
                  />
                  {/* Zone Sensor Marker */}
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={8}
                    className={`${ringColor} transition-transform duration-250 group-hover:scale-125`}
                  />
                  {/* Icon label helper */}
                  <text
                    x={zone.x}
                    y={zone.y + 3}
                    textAnchor="middle"
                    className="fill-stadium-950 font-black text-[9px] pointer-events-none"
                  >
                    {zone.type === 'elevator' ? 'E' : zone.type === 'transit' ? 'T' : zone.type === 'gate' ? 'G' : 'S'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Zone Telemetry Column */}
      <div className="flex flex-col justify-between bg-stadium-950/40 border border-stadium-800/80 rounded-xl p-5 space-y-4">
        {selectedZone ? (
          <>
            <div className="space-y-3.5">
              {/* Header */}
              <div className="border-b border-stadium-850 pb-3">
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1.5 ${
                  selectedZone.risk === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedZone.risk === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  selectedZone.risk === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-450 border border-emerald-500/30'
                }`}>
                  {selectedZone.risk.toUpperCase()} Risk Alert
                </span>
                <h4 className="text-sm font-bold text-slate-100">{selectedZone.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{selectedZone.description}</p>
              </div>

              {/* Parameters List */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-350">
                  <Users size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Occupancy Rate</span>
                    <span className="font-semibold text-slate-200">{selectedZone.occupancy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-350">
                  <Shield size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Security Guard Status</span>
                    <span className="font-semibold text-slate-200">{selectedZone.securityLevel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-350">
                  <Heart size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Medical Resources</span>
                    <span className="font-semibold text-slate-200">{selectedZone.medicalUnits}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-350">
                  <UsersRound size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Volunteers Active</span>
                    <span className="font-semibold text-slate-200">{selectedZone.volunteers}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-350">
                  <LogOut size={14} className="text-slate-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Nearest Evacuation Exit</span>
                    <span className="font-semibold text-slate-200">{selectedZone.nearestExit}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConsultAI}
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-stadium-950 font-bold text-xs rounded-xl shadow transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-gold-300"
            >
              {isLoading ? 'Orchestrating...' : 'Consult AI twin on Zone Telemetry'}
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500 text-center">
            Select a sensor node on the map to display operational parameters and dispatch recommendations.
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveStadiumMap;
