import { describe, it, expect } from 'vitest';
import { demoScenarios } from '../utils/scenarios';
import { FallbackAI } from '../services/fallbackAI';

describe('Stadium scenarios and fallbacks', () => {
  it('should load exactly 5 demo scenarios', () => {
    expect(demoScenarios.length).toBe(5);
  });

  it('should contain all required scenarios with valid properties', () => {
    const types = demoScenarios.map(s => s.type);
    expect(types).toContain('surge');
    expect(types).toContain('lost-fan');
    expect(types).toContain('accessibility');
    expect(types).toContain('maintenance');
    expect(types).toContain('sustainability');
    
    demoScenarios.forEach(scenario => {
      expect(scenario.id).toBeDefined();
      expect(scenario.title).toBeDefined();
      expect(scenario.description).toBeDefined();
      expect(scenario.severity).toBeDefined();
      expect(scenario.parameters).toBeTypeOf('object');
    });
  });

  it('should return valid fallback AIResponse structures for each scenario', () => {
    const fallback = new FallbackAI();
    
    demoScenarios.forEach(scenario => {
      const response = fallback.getScenarioFallback(scenario.id);
      
      // Phase 3 AIResponse schema validation
      expect(response).toBeDefined();
      expect(response.content).toBeTypeOf('string');
      expect(response.source).toBe('OFFLINE_INTELLIGENCE');
      expect(response.confidence).toBeTypeOf('string');
      expect(response.actions).toBeInstanceOf(Array);
      expect(response.citations).toBeInstanceOf(Array);
      expect(response.metadata).toBeTypeOf('object');
      
      // Ensure offline indicator is always present
      expect(response.content).toContain('Offline Stadium Intelligence Active');

      // Ensure citation references exist
      if (response.citations.length > 0) {
        response.citations.forEach(citation => {
          expect(citation.source).toBeDefined();
          expect(citation.section).toBeDefined();
          expect(citation.id).toBeDefined();
        });
      }
    });
  });
});
