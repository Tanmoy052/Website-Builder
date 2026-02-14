
import { AIModel, GeneratedCode, UploadedFile } from "../types";
import { generateWebsiteWithGemini } from "./geminiService";

// This is a placeholder for a future OpenAI/other provider service
const generateWithOtherProvider = async (prompt: string, files: UploadedFile[], model: AIModel): Promise<GeneratedCode | null> => {
    console.warn(`Model ${model} is not fully integrated. Using Gemini as a fallback.`);
    // As a fallback, use the Gemini service. In a real app, this would call the specific provider's API.
    return generateWebsiteWithGemini(prompt, files, 'gemini-3-pro-preview');
}

export const generateWebsite = async (prompt: string, files: UploadedFile[], model: AIModel): Promise<GeneratedCode | null> => {
    switch (model) {
        case 'gemini-3-pro-preview':
        case 'gemini-flash-latest':
            return generateWebsiteWithGemini(prompt, files, model);
        
        case 'gpt-4-turbo':
        case 'claude-3-opus':
        case 'deepseek-coder':
            // In a real-world scenario, you would have separate service files for each provider
            // e.g., generateWebsiteWithOpenAI(prompt, files, model)
            return generateWithOtherProvider(prompt, files, model);

        default:
            console.error(`Unknown model selected: ${model}`);
            throw new Error(`The selected model "${model}" is not supported.`);
    }
};
