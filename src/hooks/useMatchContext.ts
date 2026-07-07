import { useState, useEffect, useCallback } from 'react';
import type { MatchPhase } from '../types';
import { getMatchPhaseInfo, MATCH_PHASES, type MatchPhaseInfo } from '../services/matchContext';

interface UseMatchContextResult {
  currentPhase: MatchPhase;
  phaseInfo: MatchPhaseInfo;
  setPhase: (phase: MatchPhase) => void;
  nextPhase: () => void;
  phases: MatchPhaseInfo[];
}

export function useMatchContext(): UseMatchContextResult {
  const [currentPhase, setPhaseState] = useState<MatchPhase>(() => {
    const saved = localStorage.getItem('stadiumos-match-phase');
    return (saved as MatchPhase) || 'arrival';
  });

  const [phaseInfo, setPhaseInfo] = useState<MatchPhaseInfo>(() => getMatchPhaseInfo(currentPhase));

  const setPhase = useCallback((phase: MatchPhase) => {
    setPhaseState(phase);
    localStorage.setItem('stadiumos-match-phase', phase);
  }, []);

  const nextPhase = useCallback(() => {
    const currentIndex = MATCH_PHASES.findIndex(p => p.id === currentPhase);
    const nextIndex = (currentIndex + 1) % MATCH_PHASES.length;
    setPhase(MATCH_PHASES[nextIndex].id);
  }, [currentPhase, setPhase]);

  useEffect(() => {
    setPhaseInfo(getMatchPhaseInfo(currentPhase));
  }, [currentPhase]);

  return {
    currentPhase,
    phaseInfo,
    setPhase,
    nextPhase,
    phases: MATCH_PHASES
  };
}
