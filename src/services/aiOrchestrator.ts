import { sanitizeInput, validatePrompt, rateLimiter, getSessionCallsRemaining } from '../utils/security';
import { RAGEngine } from './ragEngine';
import { AICache } from './aiCache';
import { GeminiService } from './geminiService';
import { FallbackAI } from './fallbackAI';
import type { AIResponse, AIStatus } from '../types';

export class AIOrchestrator {
  private ragEngine: RAGEngine;
  private cache: AICache;
  private geminiService: GeminiService;
  private fallbackAI: FallbackAI;

  constructor() {
    this.ragEngine = new RAGEngine();
    this.cache = new AICache();
    this.geminiService = new GeminiService();
    this.fallbackAI = new FallbackAI();
  }

  setApiKey(apiKey: string): void {
    this.geminiService.setApiKey(apiKey);
  }

  async getAIStatus(): Promise<AIStatus> {
    const metrics = this.cache.getMetrics();
    const callsRemaining = getSessionCallsRemaining();
    const testResult = await this.geminiService.generateResponse('ping');
    
    return {
      geminiAvailable: testResult.success,
      requestCount: metrics.geminiCalls + metrics.cacheHits,
      cacheUsage: metrics.cacheHits,
      fallbackCount: metrics.fallbackActivations,
      ragEnabled: true,
      sessionCallsRemaining: callsRemaining
    };
  }

  detectIntent(input: string): string {
    const query = input.toLowerCase();
    if (query.includes('surge') || query.includes('crowd') || query.includes('gate g') || query.includes('density') || query.includes('congest')) {
      return 'surge';
    }
    if (query.includes('lost') || query.includes('language') || query.includes('japanese') || query.includes('ticket')) {
      return 'lost-fan';
    }
    if (query.includes('wheelchair') || query.includes('ada') || query.includes('elderly') || query.includes('lift') || query.includes('elevator')) {
      return 'accessibility';
    }
    if (query.includes('spill') || query.includes('leak') || query.includes('blocked') || query.includes('debris') || query.includes('maintenance')) {
      return 'maintenance';
    }
    if (query.includes('recycle') || query.includes('waste') || query.includes('bin') || query.includes('contamination') || query.includes('sustainability')) {
      return 'sustainability';
    }
    return 'general';
  }

  async processRequest(userInput: string): Promise<AIResponse> {
    // 1. Sanitize user input
    const sanitized = sanitizeInput(userInput);

    if (!sanitized) {
      return this.fallbackAI.getScenarioFallback('general');
    }

    // Validate prompt injection or length
    if (!validatePrompt(sanitized)) {
      const response = this.fallbackAI.getScenarioFallback('general');
      response.content = "[Security Warning] Input violates prompt validation policies. " + response.content;
      return response;
    }

    // 2. Intent Detection
    const intent = this.detectIntent(sanitized);

    // 3. RAG Context Retrieval
    const ragResult = this.ragEngine.getContextForPrompt(sanitized);

    // 4. Cache Check
    const cachedResponse = this.cache.get(sanitized);
    if (cachedResponse) {
      console.log('AIOrchestrator: Serving response from cache.');
      return cachedResponse;
    }

    // 5. Session Rate Limit Check
    const allowedByRateLimit = rateLimiter();
    if (!allowedByRateLimit) {
      console.warn('AIOrchestrator: Rate limit exceeded. Triggering Fallback.');
      this.cache.incrementMetric('fallbackActivations');
      return this.getFallbackResponseForIntent(intent, new Error('Rate limit exceeded (30 calls per session)'));
    }

    // 6. Gemini API Request
    this.cache.incrementMetric('geminiCalls');

    const systemInstruction = `You are the StadiumOS AI Main Operations Twin.
Below is the grounding context from the stadium databases. Use it to answer the user query.
Grounding Context:
${ragResult.context}

You must return a structured JSON response matching the following schema:
{
  "content": "detailed operational recommendation and advice",
  "confidence": "high" | "medium" | "low",
  "actions": ["suggested action step 1", "suggested action step 2"],
  "metadata": {
    "priority": "low" | "medium" | "high" | "critical",
    "suggestedTasks": [
      { "roleRequired": "Usher", "assignedCount": 2, "location": "Gate G", "description": "Helper text" }
    ],
    "requiredToolCalls": [
      { "name": "dispatchVolunteer", "arguments": { "roleRequired": "Usher", "location": "Gate G" } }
    ]
  }
}`;

    const prompt = `User Query: ${sanitized}`;

    const geminiResult = await this.geminiService.generateStructuredResponse<Omit<AIResponse, 'source' | 'citations'>>(
      prompt,
      systemInstruction
    );

    // 7. Response Validation & Return
    if (geminiResult.success && geminiResult.data) {
      const gData = geminiResult.data;
      
      if (typeof gData.content === 'string' && Array.isArray(gData.actions)) {
        const fullResponse: AIResponse = {
          content: gData.content,
          source: 'GEMINI',
          confidence: gData.confidence || 'medium',
          citations: ragResult.documents.map(doc => {
            const getSourceFile = (category: string): string => {
              switch (category.toLowerCase()) {
                case 'accessibility': return 'accessibility_rules.json';
                case 'volunteer logistics': return 'volunteer_manual.json';
                case 'emergency protocols': return 'emergency_protocols.json';
                default: return 'stadium_sop.json';
              }
            };
            return {
              source: getSourceFile(doc.category),
              section: doc.section,
              id: doc.id
            };
          }),
          actions: gData.actions,
          metadata: gData.metadata || {}
        };

        this.cache.set(sanitized, fullResponse);
        return fullResponse;
      }
    }

    // 8. Failure Flow -> Fallback Intelligence
    console.warn('AIOrchestrator: Gemini request failed or response validation failed. Falling back to local offline intelligence.');
    this.cache.incrementMetric('fallbackActivations');
    const apiError = new Error(geminiResult.error || 'Response validation failed');
    return this.getFallbackResponseForIntent(intent, apiError);
  }

  private getFallbackResponseForIntent(intent: string, error: Error): AIResponse {
    let scenarioId = 'general';
    if (intent === 'surge') scenarioId = 'scen-surge-emergency';
    else if (intent === 'lost-fan') scenarioId = 'scen-lost-fan';
    else if (intent === 'accessibility') scenarioId = 'scen-accessibility-request';
    else if (intent === 'maintenance') scenarioId = 'scen-maintenance-incident';
    else if (intent === 'sustainability') scenarioId = 'scen-sustainability-optimization';

    const fallbackResponse = this.fallbackAI.getScenarioFallback(scenarioId);
    fallbackResponse.metadata = {
      ...fallbackResponse.metadata,
      triggerError: error.message
    };
    return fallbackResponse;
  }
}
