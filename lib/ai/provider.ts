import { AIModel, ChatMessage, GeneratedWebsite } from './types';
import { GeminiProvider } from './adapters/gemini';
// import { OpenAIProvider } from './adapters/openai';

export class AIStudioProvider {
  private gemini = new GeminiProvider();
  // private openai = new OpenAIProvider();

  async chat(messages: ChatMessage[], model: AIModel): Promise<string> {
    if (model.includes('gemini')) {
      return this.gemini.chat(messages, model);
    }
    // Default to gemini for now as a fallback
    return this.gemini.chat(messages, model);
  }

  async generateWebsite(prompt: string, model: AIModel): Promise<GeneratedWebsite> {
    if (model.includes('gemini')) {
      return this.gemini.generateWebsite(prompt, model);
    }
    return this.gemini.generateWebsite(prompt, model);
  }
}

export const aiProvider = new AIStudioProvider();
