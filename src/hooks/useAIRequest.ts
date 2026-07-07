import { useState, useCallback } from 'react';
import type { AIResponse, MatchPhase, Persona } from '../types';
import { orchestrator } from './useAI';

interface UseAIRequestResult {
  response: AIResponse | null;
  loading: boolean;
  elapsedMs: number | null;
  error: string | null;
  processQuery: (query: string, phase?: MatchPhase, persona?: Persona) => Promise<void>;
  reset: () => void;
}

export function useAIRequest(): UseAIRequestResult {
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processQuery = useCallback(async (query: string, phase?: MatchPhase, persona?: Persona) => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    setElapsedMs(null);
    setError(null);
    const start = performance.now();
    try {
      const result = await orchestrator.processRequest(query, phase, persona);
      setResponse(result);
      setElapsedMs(Math.round(performance.now() - start));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate AI response';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setElapsedMs(null);
    setLoading(false);
    setError(null);
  }, []);

  return { response, loading, elapsedMs, error, processQuery, reset };
}
