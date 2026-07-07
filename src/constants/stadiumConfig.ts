export const LANGUAGES = ['English', 'Spanish', 'French', 'Japanese', 'Arabic'] as const;

export const TRANSPORT_MODES = ['Light Rail', 'Shuttle Bus', 'Ride-Share', 'Walking', 'Taxi'] as const;

export const ACCESSIBILITY_NEEDS = [
  'None',
  'Wheelchair',
  'Visual Assistance',
  'Hearing Loop',
  'Elderly Mobility Support',
  'Sensory Processing Needs'
] as const;

export const STADIUM_GATES = ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate G'] as const;

export const STADIUM_SECTORS = ['Sector A', 'Sector B', 'Sector C', 'Sector D'] as const;

export const RADIO_CHANNELS = [
  { ch: 'CH 1', label: 'Ingress Operations', status: 'Active', color: 'text-crowd-400' },
  { ch: 'CH 2', label: 'Facilities & Spills', status: 'Active', color: 'text-amber-400' },
  { ch: 'CH 3', label: 'Medical Dispatch', status: 'Active', color: 'text-red-400' },
  { ch: 'CH 4', label: 'Security Command', status: 'Active', color: 'text-orange-400' },
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 border-red-500/40 bg-red-500/10',
  high:     'text-orange-400 border-orange-500/40 bg-orange-500/10',
  medium:   'text-amber-400 border-amber-500/40 bg-amber-500/10',
  low:      'text-slate-400 border-slate-500/40 bg-slate-500/10',
};
