import type { AIResponse } from '../types';

export interface CacheEntry {
  response: AIResponse;
  timestamp: number;
}

export class AICache {
  private cacheKey = 'stadiumos_ai_cache';
  private metricsKey = 'stadiumos_ai_metrics';

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    if (!localStorage.getItem(this.metricsKey)) {
      localStorage.setItem(
        this.metricsKey,
        JSON.stringify({
          geminiCalls: 0,
          cacheHits: 0,
          fallbackActivations: 0
        })
      );
    }
  }

  getMetrics(): { geminiCalls: number; cacheHits: number; fallbackActivations: number } {
    try {
      const metrics = localStorage.getItem(this.metricsKey);
      return metrics ? JSON.parse(metrics) : { geminiCalls: 0, cacheHits: 0, fallbackActivations: 0 };
    } catch {
      return { geminiCalls: 0, cacheHits: 0, fallbackActivations: 0 };
    }
  }

  incrementMetric(metric: 'geminiCalls' | 'cacheHits' | 'fallbackActivations'): void {
    const current = this.getMetrics();
    current[metric]++;
    localStorage.setItem(this.metricsKey, JSON.stringify(current));
  }

  resetMetrics(): void {
    localStorage.setItem(
      this.metricsKey,
      JSON.stringify({
        geminiCalls: 0,
        cacheHits: 0,
        fallbackActivations: 0
      })
    );
  }

  private getCache(): Record<string, CacheEntry> {
    try {
      const data = localStorage.getItem(this.cacheKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveCache(cache: Record<string, CacheEntry>): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (e) {
      console.warn('AICache: failed to save to localStorage', e);
    }
  }

  get(query: string): AIResponse | null {
    const key = query.toLowerCase().trim();
    if (!key) return null;

    const cache = this.getCache();
    const entry = cache[key];
    if (entry) {
      const now = Date.now();
      if (now - entry.timestamp < 300000) { // 5 minutes TTL
        this.incrementMetric('cacheHits');
        return entry.response;
      }
      delete cache[key];
      this.saveCache(cache);
    }
    return null;
  }

  set(query: string, response: AIResponse): void {
    const key = query.toLowerCase().trim();
    if (!key) return;

    const cache = this.getCache();
    cache[key] = {
      response,
      timestamp: Date.now()
    };
    this.saveCache(cache);
  }

  clear(): void {
    localStorage.removeItem(this.cacheKey);
  }
}
