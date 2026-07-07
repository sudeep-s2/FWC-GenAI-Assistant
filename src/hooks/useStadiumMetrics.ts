import { useState, useCallback } from 'react';

const initialGateData = [
  { gate: 'A', flow: 850, capacity: 1200 },
  { gate: 'B', flow: 1080, capacity: 1200 },
  { gate: 'C', flow: 650, capacity: 1000 },
  { gate: 'D', flow: 920, capacity: 1200 },
  { gate: 'E', flow: 475, capacity: 800 },
  { gate: 'G', flow: 1185, capacity: 1200 },
];

const initialCrowdData = [
  { time: '14:00', density: 12 },
  { time: '14:30', density: 28 },
  { time: '15:00', density: 47 },
  { time: '15:30', density: 69 },
  { time: '16:00', density: 84 },
  { time: '16:30', density: 92 },
  { time: '17:00', density: 88 },
  { time: '17:30', density: 76 },
  { time: '18:00', density: 63 },
];

export function useStadiumMetrics() {
  const [attendance, setAttendance] = useState(82411);
  const [volunteersCount, setVolunteersCount] = useState(142);
  const [recyclingRate] = useState('84%');
  const [energyUsage] = useState('105%');
  const [transitLoad] = useState('Peak');
  const [gateData, setGateData] = useState(initialGateData);
  const [crowdData] = useState(initialCrowdData);

  const updateGateFlow = useCallback((gate: string, newFlow: number) => {
    setGateData(prev => prev.map(g => g.gate === gate ? { ...g, flow: newFlow } : g));
  }, []);

  return {
    attendance,
    volunteersCount,
    recyclingRate,
    energyUsage,
    transitLoad,
    gateData,
    crowdData,
    updateGateFlow,
    setAttendance,
    setVolunteersCount
  };
}
