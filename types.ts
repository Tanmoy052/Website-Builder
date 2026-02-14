
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// FIX: Removed 'gemini-flash-latest' to align with the latest recommended models for this task.
export type AIModel = 'gemini-3-pro-preview' | 'gpt-4-turbo' | 'claude-3-opus' | 'deepseek-coder';

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string; // base64 encoded content
}

export type GeneratedCode = Record<string, string>;
