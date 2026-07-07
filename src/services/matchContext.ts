import type { MatchPhase } from '../types';

export interface MatchPhaseInfo {
  id: MatchPhase;
  label: string;
  description: string;
  focusArea: string;
}

export const MATCH_PHASES: MatchPhaseInfo[] = [
  {
    id: 'arrival',
    label: 'Pre-Match Arrival',
    description: 'Spectators traveling to stadium; perimeter gates and transit hubs active.',
    focusArea: 'Transit hub loads, perimeter gate flow, outer security checkpoints, and ticket resolution.'
  },
  {
    id: 'prep',
    label: 'Kickoff Preparation',
    description: 'Fans moving to their seats; concourses and seating routes highly active.',
    focusArea: 'Concourse density, seat routing, ADA lift priorities, and seating bowl entryways.'
  },
  {
    id: 'first-half',
    label: 'First Half',
    description: 'Match in play; spectators in seating bowls, concourses cleared.',
    focusArea: 'In-seat medical standbys, interior corridor patrols, and emergency exit clearance.'
  },
  {
    id: 'half-time',
    label: 'Half-Time Surge',
    description: '15-minute break; heavy concourse flow to concessions and restrooms.',
    focusArea: 'Food court queue times, waste bin recycling overflow, restroom loads, and corridor flow.'
  },
  {
    id: 'second-half',
    label: 'Second Half',
    description: 'Pitch action resumes; fans returning to seats, egress staging begins.',
    focusArea: 'Emergency readiness, early exit tracking, and transit shuttle staging.'
  },
  {
    id: 'exit',
    label: 'Full-Time Exit',
    description: 'Match concluded; mass egress of spectators toward transport hubs.',
    focusArea: 'Metro/bus capacity, gate outflow rates, pedestrian wayfinding, and post-match zero-waste.'
  }
];

export function getMatchPhaseInfo(phase: MatchPhase): MatchPhaseInfo {
  return MATCH_PHASES.find(p => p.id === phase) || MATCH_PHASES[0];
}
