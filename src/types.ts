
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// FIX: Updated AIModel to use a more current and capable model.
export type AIModel = 'gemini-3-pro-preview' | 'gpt-4' | 'deepseek-coder';

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string; // base64 encoded content
}

export type GeneratedCode = Record<string, string>;
