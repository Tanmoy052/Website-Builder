
import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { ResultPanel } from './components/ResultPanel';
import { AIModel, Message, UploadedFile, GeneratedCode } from './types';
// FIX: Corrected import path from non-existent aiService to geminiService.
import { generateWebsite } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-3-pro-preview');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! Describe the website you want to build. You can also upload files for context. For example, "Build a portfolio website for a photographer named Jane Doe."',
    },
  ]);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>({
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Your generated website will appear here.</h1>
  <p>Use the chat on the left to get started.</p>
  <script src="script.js"></script>
</body>
</html>`,
    'style.css': `body { 
  font-family: sans-serif; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 100vh;
  background-color: #f0f0f0; 
  color: #333;
  text-align: center;
}`,
    'script.js': `console.log("Welcome to your new website!");`
  });

  const handleSendMessage = useCallback(async (prompt: string, isRegeneration = false) => {
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    if (!isRegeneration) {
        const userMessage: Message = { role: 'user', content: prompt };
        setMessages(prev => [...prev, userMessage]);
    }
    setLastUserPrompt(prompt);

    try {
      const result = await generateWebsite(prompt, uploadedFiles, selectedModel);
      if (result) {
        setGeneratedCode(result);
        const assistantMessage: Message = {
          role: 'assistant',
          content: 'I have generated the website for you. You can see the live preview and browse the code on the right.',
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error("Received an empty response from the AI.");
      }
    } catch (error) {
      console.error("Error generating website:", error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error. Please check the console for details or try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, uploadedFiles, selectedModel]);

  const handleRegenerate = useCallback(() => {
    if (lastUserPrompt) {
        handleSendMessage(lastUserPrompt, true);
    }
  }, [lastUserPrompt, handleSendMessage]);

  const handleDownloadZip = useCallback(async () => {
    if (Object.keys(generatedCode).length === 0) {
      alert("No code has been generated yet.");
      return;
    }

    const zip = new JSZip();
    Object.entries(generatedCode).forEach(([fileName, content]) => {
      zip.file(fileName, content);
    });

    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, "website-source.zip");
    });
  }, [generatedCode]);

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-200 flex flex-col font-sans overflow-hidden">
      <Header
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onDownload={handleDownloadZip}
      />
      <main className="flex-grow flex overflow-hidden">
        <Sidebar uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden border-t border-gray-700">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
          />
          <ResultPanel code={generatedCode} />
        </div>
      </main>
    </div>
  );
};

export default App;
