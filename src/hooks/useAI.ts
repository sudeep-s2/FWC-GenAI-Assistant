import { useState, useCallback } from 'react';
import type { AIResponse } from '../types';
import { AIOrchestrator } from '../services/aiOrchestrator';

// Module-level singleton to avoid re-instantiation on every render
export const orchestrator = new AIOrchestrator();

interface UseAIResult {
  response: AIResponse | null;
  loading: boolean;
  elapsedMs: number | null;
  processQuery: (query: string) => Promise<void>;
  reset: () => void;
}

export function useAI(): UseAIResult {
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const processQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    setElapsedMs(null);
    const start = performance.now();
    try {
      const result = await orchestrator.processRequest(query);
      setResponse(result);
      setElapsedMs(Math.round(performance.now() - start));
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setElapsedMs(null);
    setLoading(false);
  }, []);

  return { response, loading, elapsedMs, processQuery, reset };
}
