import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIModel, ChatMessage, GeneratedWebsite } from "../types";

export class GeminiProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async chat(messages: ChatMessage[], model: AIModel): Promise<string> {
    const geminiModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = geminiModel.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    return result.response.text();
  }

  async generateWebsite(prompt: string, model: AIModel): Promise<GeneratedWebsite> {
    const geminiModel = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `You are a senior-level AI Software Architect. 
    Generate a full production-ready website based on the user prompt.
    Return a JSON object with a 'files' array, where each item has 'path' and 'content'.
    Include:
    - Frontend (React/Next.js)
    - Tailwind CSS styles
    - Basic API routes
    - README.md
    
    Structure the JSON like this:
    {
      "files": [
        { "path": "app/page.tsx", "content": "..." },
        { "path": "package.json", "content": "..." }
      ]
    }`;

    const result = await geminiModel.generateContent([
      { text: systemPrompt },
      { text: `User Prompt: ${prompt}` }
    ]);

    const responseText = result.response.text();
    try {
      return JSON.parse(responseText) as GeneratedWebsite;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", responseText);
      return { files: [{ path: "error.txt", content: "Failed to generate website structure." }] };
    }
  }
}
