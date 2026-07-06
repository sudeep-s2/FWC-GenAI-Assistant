import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AIOrchestrator } from '../services/aiOrchestrator';
import { resetSessionRateLimit } from '../utils/security';

describe('AIOrchestrator pipeline', () => {
  const originalFetch = globalThis.fetch;
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
    mockFetch.mockClear();
    localStorage.clear();
    sessionStorage.clear();
    resetSessionRateLimit();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should run the complete pipeline successfully including RAG and Cache caching', async () => {
    const mockAIResponseJson = JSON.stringify({
      content: 'Buffering is recommended for the outer gates.',
      confidence: 'high',
      actions: ['Deploy barriers', 'Use detour signs'],
      metadata: {
        priority: 'high',
        suggestedTasks: [],
        requiredToolCalls: []
      }
    });

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: mockAIResponseJson }]
            }
          }
        ]
      })
    });

    const orchestrator = new AIOrchestrator();
    
    const result1 = await orchestrator.processRequest('surge near Gate G');
    
    expect(result1.source).toBe('GEMINI');
    expect(result1.content).toContain('Buffering');
    expect(result1.citations.length).toBeGreaterThan(0);
    expect(result1.citations[0].source).toBe('stadium_sop.json');
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const result2 = await orchestrator.processRequest('surge near Gate G');
    
    expect(result2.source).toBe('GEMINI');
    expect(result2.content).toBe(result1.content);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should fall back to Offline Intelligence if Gemini API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    const orchestrator = new AIOrchestrator();
    const result = await orchestrator.processRequest('wheelchair request Light Rail');
    
    expect(result.source).toBe('OFFLINE_INTELLIGENCE');
    expect(result.content).toContain('Offline Stadium Intelligence Active');
    expect(result.content).toContain('shuttle');
    expect(result.citations.some(c => c.source === 'accessibility_rules.json')).toBe(true);
  });

  it('should trigger offline fallback when session rate limit of 30 calls is reached', async () => {
    sessionStorage.setItem('stadiumos_session_api_calls', '30');

    const orchestrator = new AIOrchestrator();
    const result = await orchestrator.processRequest('Gate G congestion');
    
    expect(result.source).toBe('OFFLINE_INTELLIGENCE');
    expect(result.content).toContain('Offline Stadium Intelligence Active');
    expect(result.metadata.triggerError).toContain('Rate limit exceeded');
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
