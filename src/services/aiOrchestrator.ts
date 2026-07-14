import { sanitizeInput, validatePrompt, rateLimiter, getSessionCallsRemaining } from '../utils/security';
import { RAGEngine } from './ragEngine';
import { AICache } from './aiCache';
import { GeminiService } from './geminiService';
import { FallbackAI } from './fallbackAI';
import type { AIResponse, AIStatus, MatchPhase, Persona } from '../types';

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
    if (query.includes('predictive') || query.includes('prediction') || query.includes('30-minute') || query.includes('30 min') || query.includes('forecast')) {
      return 'predictive';
    }
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

  async processRequest(userInput: string, matchPhase?: MatchPhase, activePersona?: Persona): Promise<AIResponse> {
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
      return this.getFallbackResponseForIntent(intent, new Error('Rate limit exceeded (30 calls per session)'), matchPhase, activePersona, sanitized, ragResult.documents);
    }

    // 6. Gemini API Request
    this.cache.incrementMetric('geminiCalls');

    let phaseFocus = 'Focus areas: Matchday Operations perimeter monitoring.';
    if (matchPhase) {
      if (matchPhase === 'PRE_MATCH') {
        phaseFocus = 'Focus areas: Transit hub loads, parking lot allocations, perimeter gate flow, and arrival waves.';
      } else if (matchPhase === 'ENTRY') {
        phaseFocus = 'Focus areas: Gate pressure checks, security queue pacing, ticket scanner checks, and seating bowl flow.';
      } else if (matchPhase === 'HALFTIME') {
        phaseFocus = 'Focus areas: Concourse Food Plaza queues, restroom demand, and general concourse movement.';
      } else if (matchPhase === 'POST_MATCH') {
        phaseFocus = 'Focus areas: Spectator egress, public transit train load balancing, and crowd dispersal.';
      }
    }

    let personaInstructions = 'Focus areas: Standard operational support.';
    if (activePersona) {
      if (activePersona === 'Fan') {
        personaInstructions = 'Active Persona: Fan. Focus on seat routing directions, public transit/shuttle schedules, language translation helpers, and customer amenities.';
      } else if (activePersona === 'Volunteer') {
        personaInstructions = 'Active Persona: Volunteer. Focus on active incident dispatching, volunteer manual checks, task checklists, and radio communication channels.';
      } else if (activePersona === 'Organizer') {
        personaInstructions = 'Active Persona: Organizer. Focus on matchday operations command, predictive crowd risk prevention, and resource allocations.';
      } else if (activePersona === 'Accessibility Guest') {
        personaInstructions = 'Active Persona: Accessibility Guest. Focus on ADA ramps, elevator priority controls, wheelchair cart shuttle coordinates, and sensory quiet rooms.';
      }
    }

    const systemInstruction = `You are the FIFA World Cup 2026 Real-Time Operations Intelligence System AI Twin.
Below is the grounding context from the stadium databases. Use it to answer the user query.
Grounding Context:
${ragResult.context}

Active Match Phase: ${matchPhase || 'PRE_MATCH'}
${phaseFocus}

Active Persona View: ${activePersona || 'Organizer'}
${personaInstructions}

You must return a structured JSON response matching the following schema.
CRITICAL: Do NOT wrap the JSON response in markdown code blocks like \`\`\`json or \`\`\`. Output raw JSON text only.
{
  "content": "detailed operational recommendation. You MUST format this string to strictly follow this structure: ### Situation\\n[situation description]\\n\\n### Risk Level\\n[Low/Medium/High/Critical]\\n\\n### Root Cause\\n[root cause]\\n\\n### Recommended Actions\\n[actions]\\n\\n### Required Personnel\\n[required roles]\\n\\n### Expected Impact\\n[mitigation targets]\\n\\n### Confidence\\n[Low/Medium/High]\\n\\n### Evidence\\n[citations or sensor log references]",
  "confidence": "high" | "medium" | "low",
  "actions": ["suggested action step 1", "suggested action step 2"],
  "factorsConsidered": ["✓ Match phase", "✓ Crowd density", "✓ Stadium SOP", "✓ Transport status", "✓ Accessibility requirements"],
  "metadata": {
    "priority": "low" | "medium" | "high" | "critical",
    "currentStatus": "Brief description of the current situation (Only if query is predictive crowd forecasting)",
    "predictedIssue": "Predicted bottleneck or load warning (Only if query is predictive crowd forecasting)",
    "estimatedTime": "Estimated time window for predicted incident (Only if query is predictive crowd forecasting)",
    "preventionSteps": ["action step 1", "action step 2"],
    "suggestedTasks": [
      { "roleRequired": "Usher", "assignedCount": 2, "location": "Gate G", "description": "Helper text" }
    ],
    "requiredToolCalls": [
      { "name": "dispatchVolunteer", "arguments": { "roleRequired": "Usher", "location": "Gate G" } }
    ]
  }
}`;

    const prompt = `User Query: ${sanitized}`;

    // Define configured AI providers list (Layer 1 & Layer 2)
    interface AIProvider {
      name: 'GEMINI' | 'OPENAI' | 'GROQ';
      apiKey: string | undefined;
      callFn: (p: string, s: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    }

    const providers: AIProvider[] = [
      {
        name: 'GEMINI',
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'has_default',
        callFn: async (p, s) => {
          let res = await this.geminiService.generateStructuredResponse<Omit<AIResponse, 'source' | 'citations'>>(p, s);
          if (!res.success) {
            const backupKey = import.meta.env.VITE_BACKUP_GEMINI_API_KEY;
            if (backupKey) {
              console.warn('[Failover Engine] Primary Gemini key failed. Swapping credentials and retrying.');
              this.geminiService.setApiKey(backupKey);
              res = await this.geminiService.generateStructuredResponse<Omit<AIResponse, 'source' | 'citations'>>(p, s);
            }
          }
          return res;
        }
      },
      {
        name: 'OPENAI',
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        callFn: async (p, s) => {
          console.warn('[Failover Engine] Swapping provider to OpenAI...');
          return this.fetchOpenAI(p, s, import.meta.env.VITE_OPENAI_API_KEY || '');
        }
      },
      {
        name: 'GROQ',
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        callFn: async (p, s) => {
          console.warn('[Failover Engine] Swapping provider to Groq...');
          return this.fetchGroq(p, s, import.meta.env.VITE_GROQ_API_KEY || '');
        }
      }
    ];

    let apiData: Omit<AIResponse, 'source' | 'citations'> | null = null;
    let finalSource: 'GEMINI' | 'OPENAI' | 'GROQ' = 'GEMINI';
    let errorMessage = 'All providers failed.';

    for (const provider of providers) {
      if (provider.apiKey) {
        try {
          const result = await provider.callFn(prompt, systemInstruction);
          if (result.success && result.data) {
            apiData = result.data;
            finalSource = provider.name;
            break;
          } else {
            errorMessage += ` [${provider.name}: ${result.error || 'Validation error'}]`;
          }
        } catch (e: any) {
          errorMessage += ` [${provider.name} error: ${e.message}]`;
        }
      }
    }

    // 7. Response Validation & Return
    if (apiData && typeof apiData.content === 'string' && Array.isArray(apiData.actions)) {
      const fullResponse: AIResponse = {
        content: apiData.content,
        source: finalSource,
        confidence: apiData.confidence || 'medium',
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
        actions: apiData.actions,
        factorsConsidered: apiData.factorsConsidered || [
          '✓ Match phase',
          '✓ Crowd density',
          '✓ Stadium SOP',
          '✓ Transport status',
          `✓ Active Persona: ${activePersona || 'Organizer'}`
        ],
        metadata: apiData.metadata || {}
      };

      this.cache.set(sanitized, fullResponse);
      return fullResponse;
    }

    // 8. Failure Flow -> Fallback Intelligence
    console.warn('AIOrchestrator: All configured AI services failed or response validation failed. Falling back to local offline intelligence.');
    this.cache.incrementMetric('fallbackActivations');
    const apiError = new Error(errorMessage);
    return this.getFallbackResponseForIntent(intent, apiError, matchPhase, activePersona, sanitized, ragResult.documents);
  }

  private getFallbackResponseForIntent(
    intent: string,
    error: Error,
    matchPhase?: MatchPhase,
    activePersona?: Persona,
    query?: string,
    documents?: import('../types').KnowledgeDocument[]
  ): AIResponse {
    const isSimulationScenario = query && query.includes('[FIFA 2026 Simulation]');

    // 1. Simulation Console Scenario Mock bypass
    if (isSimulationScenario) {
      let scenarioId = 'general';
      if (intent === 'predictive') scenarioId = 'scen-predictive-risk';
      else if (intent === 'surge') scenarioId = 'scen-surge-emergency';
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

    // 2. Layer 3: Dynamic RAG synthesis
    if (documents && documents.length > 0 && query) {
      const fallbackResponse = this.fallbackAI.synthesizeResponseFromRAG(query, documents, matchPhase, activePersona);
      fallbackResponse.metadata = {
        ...fallbackResponse.metadata,
        triggerError: error.message
      };
      return fallbackResponse;
    }

    // 3. Layer 4: Deterministic Emergency Rules Engine
    const fallbackResponse = this.fallbackAI.getDeterministicEmergencyGuidance(query || intent, matchPhase, activePersona);
    fallbackResponse.metadata = {
      ...fallbackResponse.metadata,
      triggerError: error.message
    };
    return fallbackResponse;
  }

  private async fetchOpenAI(
    prompt: string,
    systemInstruction: string,
    apiKey: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `OpenAI error ${response.status}: ${errorText}` };
      }

      const resJson = await response.json();
      const contentText = resJson.choices?.[0]?.message?.content;
      if (!contentText) {
        return { success: false, error: 'OpenAI returned empty message content.' };
      }

      const data = JSON.parse(contentText);
      return { success: true, data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  private async fetchGroq(
    prompt: string,
    systemInstruction: string,
    apiKey: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('https://api.groq.com/openapi/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Groq error ${response.status}: ${errorText}` };
      }

      const resJson = await response.json();
      const contentText = resJson.choices?.[0]?.message?.content;
      if (!contentText) {
        return { success: false, error: 'Groq returned empty message content.' };
      }

      const data = JSON.parse(contentText);
      return { success: true, data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}
