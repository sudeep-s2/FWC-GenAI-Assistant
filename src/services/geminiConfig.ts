export interface SafetySetting {
  category: 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT' | 'HARM_CATEGORY_DANGEROUS_CONTENT';
  threshold: 'BLOCK_NONE' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_ONLY_HIGH';
}

export interface GeminiConfig {
  apiKey: string;
  modelName: string;
  apiEndpoint: string;
  temperature: number;
  maxOutputTokens: number;
  safetySettings: SafetySetting[];
}

export const defaultGeminiConfig: GeminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  modelName: 'gemini-2.5-flash',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  temperature: 0.2,
  maxOutputTokens: 2048,
  safetySettings: [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
  ]
};
