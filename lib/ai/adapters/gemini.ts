import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIModel, ChatMessage, GeneratedWebsite } from "../types";

export class GeminiProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async chat(messages: ChatMessage[], model: AIModel): Promise<string> {
    const systemMessage = messages.find((m) => m.role === "system");
    const otherMessages = messages.filter((m) => m.role !== "system");

    const geminiModel = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: systemMessage?.content || "" }],
      },
    });

    const chat = geminiModel.startChat({
      history: otherMessages.slice(0, -1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(
      otherMessages[otherMessages.length - 1].content,
    );
    return result.response.text();
  }

  async generateWebsite(
    prompt: string,
    model: AIModel,
  ): Promise<GeneratedWebsite> {
    const systemPrompt = `You are a senior-level AI Software Architect and Frontend Developer. 
    Generate a full production-ready website based on the user prompt.
    
    CRITICAL: You MUST return a JSON object with a 'files' array.
    Each file must have a 'path' and 'content' string.
    
    REQUIRED FILES:
    1. 'index.html': A COMPLETE, STANDALONE HTML file using Tailwind CSS via CDN. This is for the LIVE PREVIEW. It must be beautiful and functional.
    2. 'app/page.tsx': The Next.js/React implementation of the site.
    3. 'README.md': Documentation.
    
    Structure your response EXACTLY like this:
    {
      "files": [
        { "path": "index.html", "content": "<!DOCTYPE html><html>...</html>" },
        { "path": "app/page.tsx", "content": "export default function..." }
      ]
    }
    
    Do not include any text before or after the JSON.`;

    const geminiModel = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: { responseMimeType: "application/json" },
    });

    try {
      const result = await geminiModel.generateContent([
        { text: `User Prompt: ${prompt}` },
      ]);

      const responseText = result.response.text();
      console.log("[GEMINI] Raw response:", responseText);
      const parsed = JSON.parse(responseText) as GeneratedWebsite;
      if (!parsed.files || !Array.isArray(parsed.files)) {
        throw new Error("Invalid response format: missing files array");
      }
      return parsed;
    } catch (e: any) {
      console.error("[GEMINI] Generation Error:", e);
      const errorMessage =
        e.status === 429
          ? "Rate limit exceeded. Please wait a moment and try again."
          : e.message || "Failed to parse AI response";

      return {
        files: [
          {
            path: "index.html",
            content: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;"><h1>Generation Error</h1><p>${errorMessage}</p></body></html>`,
          },
        ],
      };
    }
  }
}
