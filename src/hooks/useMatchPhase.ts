import { useCallback } from 'react';
import type { MatchPhase } from '../types';
import { useApp } from '../context/AppContext';

export interface MatchPhaseInfo {
  id: MatchPhase;
  label: string;
  focusArea: string;
  description: string;
}

export const MATCH_PHASES: MatchPhaseInfo[] = [
  {
    id: 'PRE_MATCH',
    label: 'Pre-Match (T-3 Hours)',
    focusArea: 'Transit hub loads, parking lot allocations, perimeter gate flow, and arrival waves.',
    description: 'Spectators traveling to stadium; perimeter gates and transit hubs active.'
  },
  {
    id: 'ENTRY',
    label: 'Entry (T-30 Minutes)',
    focusArea: 'Gate pressure, security queue pacing, ticket scanner checks, and seating bowl flow.',
    description: 'Main gates open; high density at turnstiles and security checkpoints.'
  },
  {
    id: 'HALFTIME',
    label: 'Halftime',
    focusArea: 'Concourse Food Plaza queues, restroom demand, and general concourse movement.',
    description: 'Spectators leaving seats; concessions and recycling stations peak.'
  },
  {
    id: 'POST_MATCH',
    label: 'Post-Match',
    focusArea: 'Spectator egress, public transit train load balancing, and crowd dispersal.',
    description: 'Match ended; crowd egress towards metro and shuttle zones.'
  }
];

export function useMatchPhase() {
  const { state, dispatch } = useApp();
  const currentPhase = state.matchPhase;

  const setPhase = useCallback((phase: MatchPhase) => {
    dispatch({ type: 'SET_MATCH_PHASE', payload: phase });
    localStorage.setItem('stadiumos-match-phase', phase);
  }, [dispatch]);

  const phaseInfo = MATCH_PHASES.find(p => p.id === currentPhase) || MATCH_PHASES[0];

  return {
    currentPhase,
    phaseInfo,
    setPhase,
    phases: MATCH_PHASES
  };
}
