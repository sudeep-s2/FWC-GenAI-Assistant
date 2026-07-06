import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeminiService } from '../services/geminiService';

describe('GeminiService Fetch Integration', () => {
  const originalFetch = globalThis.fetch;
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should return a successful response from Gemini API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Mock response text' }]
            }
          }
        ]
      })
    });

    const service = new GeminiService('valid-key');
    const result = await service.generateResponse('test prompt');
    
    expect(result.success).toBe(true);
    expect(result.data).toBe('Mock response text');
  });

  it('should handle API errors politely and return a controlled failure object', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'API Key Invalid'
    });

    const service = new GeminiService('invalid-key');
    const result = await service.generateResponse('test prompt');
    
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(400);
    expect(result.error).toContain('API Key Invalid');
  });

  it('should handle HTTP 429 (quota exceeded) rate limits', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => 'Quota exceeded'
    });

    const service = new GeminiService('valid-key');
    const result = await service.generateResponse('test prompt');
    
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(429);
    expect(result.error).toContain('Quota exceeded');
  });

  it('should trigger a timeout when response exceeds 10 seconds', async () => {
    mockFetch.mockImplementationOnce(() => {
      const abortError = new Error('The user aborted a request.');
      abortError.name = 'AbortError';
      return Promise.reject(abortError);
    });

    const service = new GeminiService('valid-key');
    const result = await service.generateResponse('test prompt');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('timeout');
  });
});
