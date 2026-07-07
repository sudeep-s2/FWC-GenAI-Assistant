import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

interface CrowdWidgetProps {
  crowdData: { time: string; density: number }[];
}

const CrowdWidget: React.FC<CrowdWidgetProps> = ({ crowdData }) => {
  const currentDensity = 92;
  const radialData = [{ value: currentDensity, fill: '#ef4444' }];

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-stadium-800 pb-2">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-crowd-400" />
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Crowd Density Metrics</h3>
        </div>
        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Critical Load</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Radial gauge */}
        <div className="flex flex-col items-center justify-center p-3 bg-stadium-900/20 border border-stadium-800/40 rounded-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Peak Gate Load</span>
          <div role="img" aria-label={`Current Peak Ingress Gate G density is at ${currentDensity} percent`}>
            <ResponsiveContainer width={100} height={100}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" data={radialData} startAngle={225} endAngle={-45}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#162948' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-2xl font-black text-red-400 -mt-3">{currentDensity}%</span>
          <span className="text-[9px] text-slate-500 mt-1">Gate G outer perimeter</span>
        </div>

        {/* Timeline Chart */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
            <TrendingUp size={12} className="text-crowd-450" />
            <span>Spectator density trend over matchday sequence (%)</span>
          </div>
          <div role="img" aria-label="Line graph tracking spectator density percentage increase from 14:00 (12%) to 16:30 peak (92%) before kickoff.">
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={crowdData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="crowdGradTwin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f/50" />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#0a1220', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e2e8f0', fontSize: 10 }}
                />
                <Area type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={1.5} fill="url(#crowdGradTwin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdWidget;
