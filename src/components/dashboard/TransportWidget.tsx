import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bus } from 'lucide-react';

interface TransportWidgetProps {
  gateData: { gate: string; flow: number; capacity: number }[];
}

const TransportWidget: React.FC<TransportWidgetProps> = ({ gateData }) => {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-stadium-800 pb-2">
        <Bus size={16} className="text-gold-400" />
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">FIFA Ingress Flow vs. Capacity</h3>
      </div>

      <div role="img" aria-label="Ingress throughput bar chart showing spectator volume rates compared to maximum safety caps at gates A to G. Gate G is near threshold capacity.">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={gateData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f/50" />
            <XAxis dataKey="gate" tick={{ fill: '#475569', fontSize: 9 }} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
            <Tooltip contentStyle={{ background: '#0a1220', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e2e8f0', fontSize: 10 }} />
            <Legend wrapperStyle={{ fontSize: 9, color: '#94a3b8' }} />
            <Bar dataKey="capacity" name="Gate Capacity" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
            <Bar dataKey="flow" name="Ingress Flow (fans/hr)" fill="#f5c518" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransportWidget;
