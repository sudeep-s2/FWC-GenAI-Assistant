import { useState, useCallback } from 'react';
import type { StadiumScenario, MatchPhase, AIResponse } from '../types';
import { useAIRequest } from './useAIRequest';

interface UseDemoScenarioResult {
  activeScenario: StadiumScenario | null;
  loading: boolean;
  response: AIResponse | null;
  elapsedMs: number | null;
  triggerScenario: (scenario: StadiumScenario, phase?: MatchPhase) => Promise<void>;
  clearScenario: () => void;
}

export function useDemoScenario(): UseDemoScenarioResult {
  const [activeScenario, setActiveScenario] = useState<StadiumScenario | null>(null);
  const { response, loading, elapsedMs, processQuery, reset } = useAIRequest();

  const triggerScenario = useCallback(async (scenario: StadiumScenario, phase?: MatchPhase) => {
    setActiveScenario(scenario);
    
    // Construct a specific operations prompt based on the scenario
    let prompt = `[FIFA 2026 Simulation] Action Plan for ${scenario.title}. Incident Level: ${scenario.severity.toUpperCase()}.`;
    
    if (scenario.parameters) {
      const parts: string[] = [];
      if (scenario.parameters.stadiumArea) parts.push(`Sect/Area: ${scenario.parameters.stadiumArea}`);
      if (scenario.parameters.crowdPercentage) parts.push(`Current Density: ${scenario.parameters.crowdPercentage}%`);
      if (scenario.parameters.seatLocation) parts.push(`Seat Details: ${scenario.parameters.seatLocation}`);
      if (scenario.parameters.language) parts.push(`Lang: ${scenario.parameters.language}`);
      if (scenario.parameters.accessibilityRequirement) parts.push(`ADA Needs: ${scenario.parameters.accessibilityRequirement}`);
      if (scenario.parameters.issue) parts.push(`Issue Reported: ${scenario.parameters.issue}`);
      
      if (parts.length > 0) {
        prompt += ` Params: [${parts.join(', ')}].`;
      }
    }
    
    await processQuery(prompt, phase);
  }, [processQuery]);

  const clearScenario = useCallback(() => {
    setActiveScenario(null);
    reset();
  }, [reset]);

  return {
    activeScenario,
    loading,
    response,
    elapsedMs,
    triggerScenario,
    clearScenario
  };
}
