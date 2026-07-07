export const LANGUAGES = ['English', 'Spanish', 'French', 'Japanese', 'Arabic'] as const;

export const TRANSPORT_MODES = [
  'Rail Connection Express (NJ Transit)',
  'MetLife Shuttle Buses',
  'Ride-Share Lot Hub',
  'Pedestrian Plaza Corridor',
  'VIP Transit Shuttle'
] as const;

export const ACCESSIBILITY_NEEDS = [
  'None',
  'Wheelchair Ramp Lift',
  'Visual Braille Paths',
  'Hearing Induction Loops',
  'Elderly Mobility Buggies',
  'Sensory Quiet Suite'
] as const;

export const STADIUM_GATES = [
  'Gate A (NJ Transit Rail Entry)',
  'Gate B (Plaza Ingress)',
  'Gate C (East Concourse)',
  'Gate D (West Concourse)',
  'Gate E (ADA Accessible Lift Lobby)',
  'Gate F (Media / VIP Portals)'
] as const;

export const STADIUM_SECTORS = [
  'Sector A (Lower Bowl Platform)',
  'Sector B (Upper Deck Seating)',
  'Sector C (VIP Club Suites)',
  'Sector D (ADA Designated Companion Deck)'
] as const;

export const VENUE_INFO = {
  name: 'New York New Jersey Stadium (MetLife Stadium)',
  city: 'East Rutherford, NJ',
  capacity: 82500,
  match: 'Brazil vs Germany',
  transitInfo: 'NJ Transit Meadowlands Rail Connection Express Line',
} as const;

export const RADIO_CHANNELS = [
  { ch: 'CH 1', label: 'MetLife Ingress Control', status: 'Active', color: 'text-crowd-400' },
  { ch: 'CH 2', label: 'Facilities Maintenance & Spills', status: 'Active', color: 'text-amber-400' },
  { ch: 'CH 3', label: 'First Aid & Medical Dispatch', status: 'Active', color: 'text-red-400' },
  { ch: 'CH 4', label: 'FIFA Security Command Escalation', status: 'Active', color: 'text-orange-400' },
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 border-red-500/40 bg-red-500/10',
  high:     'text-orange-400 border-orange-500/40 bg-orange-500/10',
  medium:   'text-amber-400 border-amber-500/40 bg-amber-500/10',
  low:      'text-slate-400 border-slate-500/40 bg-slate-500/10',
};
