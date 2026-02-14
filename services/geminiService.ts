
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { UploadedFile, GeneratedCode, AIModel } from '../types';

const fileToPart = (file: UploadedFile) => {
  return {
    inlineData: {
      mimeType: file.type,
      data: file.content,
    },
  };
};

const buildSystemInstruction = () => `
You are an expert full-stack web developer AI. Your task is to generate a complete, functional, and aesthetically pleasing website based on the user's prompt.

You MUST follow these rules strictly:
1.  Generate all necessary files: HTML, CSS, and JavaScript. You can generate multiple CSS and JS files if needed.
2.  Create a modern and responsive design using pure HTML, CSS, and JS. Do NOT use any frameworks like React, Vue, or Angular in the generated code unless specifically asked.
3.  Ensure the file structure is simple and logical (e.g., index.html, style.css, script.js). All file paths should be relative and at the root level.
4.  Your entire response MUST be a single, valid JSON object, which is an array of file objects.
5.  Each file object in the array must have two string properties: "fileName" and "content".
6.  Do not include any explanations, comments, or markdown formatting outside of the file content itself. The response should be ONLY the JSON object.
7.  If the user provides files, use their content as context for the website generation. For example, a text file might contain the copy for the website, or an image might be a reference for a logo or banner.
8.  Make the generated website visually appealing with a good color palette, typography, and layout.
`;

// FIX: Renamed function to match usage in App.tsx.
export const generateWebsite = async (prompt: string, files: UploadedFile[], model: AIModel): Promise<GeneratedCode | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [{ text: `User prompt: ${prompt}` }];
  if (files.length > 0) {
    parts.push({ text: "\n\n--- User-provided files for context ---" });
    files.forEach(file => {
      parts.push({ text: `\nFile: ${file.name}\n` });
      parts.push(fileToPart(file));
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: buildSystemInstruction(),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              fileName: {
                type: Type.STRING,
                description: 'The name of the file (e.g., "index.html").',
              },
              content: {
                type: Type.STRING,
                description: 'The full content of the file.',
              },
            },
            required: ['fileName', 'content'],
          },
        }
      },
    });

    const text = response.text;
    if (!text) {
      console.error("Gemini API returned an empty text response.");
      return null;
    }
    
    // Clean potential markdown code block fences
    const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    const parsedArray = JSON.parse(cleanedText) as {fileName: string, content: string}[];

    const generatedCode: GeneratedCode = parsedArray.reduce((acc, file) => {
      if (file.fileName && typeof file.fileName === 'string' && typeof file.content === 'string') {
          acc[file.fileName.trim()] = file.content;
      }
      return acc;
    }, {} as GeneratedCode);

    return generatedCode;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
