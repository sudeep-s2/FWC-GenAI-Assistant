import type { MatchPhase, Persona } from '../types';

export type AppAction =
  | { type: 'SET_USER_ROLE'; payload: string }
  | { type: 'SET_GEMINI_STATUS'; payload: 'idle' | 'loading' | 'success' | 'error' }
  | { type: 'LOG_EVENT'; payload: string }
  | { type: 'SET_MATCH_PHASE'; payload: MatchPhase }
  | { type: 'SET_PERSONA'; payload: Persona };
