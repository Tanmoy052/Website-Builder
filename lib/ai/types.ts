export type AIModel = 'gpt-4o' | 'gemini-2.0-flash' | 'deepseek-v3';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProvider {
  chat(messages: ChatMessage[], model: AIModel): Promise<string>;
  generateWebsite(prompt: string, model: AIModel): Promise<GeneratedWebsite>;
}

export interface GeneratedWebsite {
  files: {
    path: string;
    content: string;
  }[];
}
