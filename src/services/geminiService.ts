import { defaultGeminiConfig } from './geminiConfig';

export interface GeminiServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export class GeminiService {
  private apiKey: string;
  private apiEndpoint: string;
  private modelName: string;

  constructor(
    apiKey: string = defaultGeminiConfig.apiKey,
    modelName: string = defaultGeminiConfig.modelName,
    apiEndpoint: string = defaultGeminiConfig.apiEndpoint
  ) {
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.apiEndpoint = apiEndpoint;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async generateResponse(
    prompt: string,
    systemInstruction?: string
  ): Promise<GeminiServiceResult<string>> {
    if (!this.apiKey) {
      return { success: false, error: 'API key is missing' };
    }

    const url = `${this.apiEndpoint}/${this.modelName}:generateContent?key=${this.apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const requestBody: Record<string, unknown> = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        safetySettings: defaultGeminiConfig.safetySettings.map(setting => ({
          category: setting.category,
          threshold: setting.threshold
        })),
        generationConfig: {
          temperature: defaultGeminiConfig.temperature,
          maxOutputTokens: defaultGeminiConfig.maxOutputTokens
        }
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          statusCode: response.status,
          error: `Gemini API Error: Status ${response.status}. Details: ${errorText}`
        };
      }

      const responseData = await response.json();
      const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text !== 'string') {
        return {
          success: false,
          error: 'Malformed response structure from Gemini API'
        };
      }

      return { success: true, data: text };

    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const error = err as Error;
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout (10s exceeded)' };
      }
      return { success: false, error: error.message || 'Unknown network error' };
    }
  }

  async generateStructuredResponse<T>(
    prompt: string,
    systemInstruction?: string
  ): Promise<GeminiServiceResult<T>> {
    if (!this.apiKey) {
      return { success: false, error: 'API key is missing' };
    }

    const url = `${this.apiEndpoint}/${this.modelName}:generateContent?key=${this.apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const requestBody: Record<string, unknown> = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        safetySettings: defaultGeminiConfig.safetySettings.map(setting => ({
          category: setting.category,
          threshold: setting.threshold
        })),
        generationConfig: {
          temperature: defaultGeminiConfig.temperature,
          maxOutputTokens: defaultGeminiConfig.maxOutputTokens,
          responseMimeType: 'application/json'
        }
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          statusCode: response.status,
          error: `Gemini API Error: Status ${response.status}. Details: ${errorText}`
        };
      }

      const responseData = await response.json();
      const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text !== 'string') {
        return {
          success: false,
          error: 'Malformed response structure from Gemini API'
        };
      }

      try {
        const structuredData = JSON.parse(text) as T;
        return { success: true, data: structuredData };
      } catch (parseError) {
        return {
          success: false,
          error: `JSON parsing failed. Details: ${(parseError as Error).message}`
        };
      }

    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const error = err as Error;
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout (10s exceeded)' };
      }
      return { success: false, error: error.message || 'Unknown network error' };
    }
  }
}
