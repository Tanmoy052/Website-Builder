"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatPanel } from "./components/ChatPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { ModelSelector } from "./components/ModelSelector";
import { AuthModal } from "./components/auth/AuthModal";
import { AIModel, ChatMessage } from "@/lib/ai/types";
import {
  Layers,
  Share2,
  Play,
  LogIn,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export default function StudioPage() {
  const [selectedModel, setSelectedModel] =
    useState<AIModel>("gemini-2.0-flash");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<
    { path: string; content: string }[]
  >([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any>({
    chats: [],
    projects: [],
    files: [],
  });

  useEffect(() => {
    // Check session on load
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          setUser(data.user);
          loadHistory();
        }
      });
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/auth/history");
      const data = await res.json();
      if (!data.error) {
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMessages([]);
    setGeneratedFiles([]);
    setHistory({ chats: [], projects: [], files: [] });
  };

  const onAuthSuccess = (userData: any) => {
    setUser(userData);
    loadHistory();
  };

  const handleSendMessage = async (content: string) => {
    const newUserMessage: ChatMessage = { role: "user", content };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, model: selectedModel }),
      });

      const data = await response.json();

      if (data.isWebsiteRequest) {
        // If the AI decides to generate a website
        const genResponse = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: content, model: selectedModel }),
        });
        const genData = await genResponse.json();
        setGeneratedFiles(genData.files);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I've generated a website for you! You can preview it in the panel on the right.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your API keys.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="studio-container flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-studio-border flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-studio-accent rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <h1 className="font-semibold text-gray-900">AI Studio</h1>
            </div>
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 mr-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-studio-border">
                  <UserIcon size={14} className="text-studio-accent" />
                  <span className="text-xs font-medium text-gray-700">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-studio-accent border border-studio-accent rounded-lg hover:bg-blue-50 transition-all mr-4"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-studio-accent text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              <Play size={14} fill="currentColor" />
              <span>Deploy</span>
            </button>
          </div>
        </header>

        {/* Studio Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel */}
          <div className="w-[450px] shrink-0 border-r border-studio-border">
            <ChatPanel
              messages={messages}
              isLoading={isGenerating}
              onSendMessage={handleSendMessage}
            />
          </div>

          {/* Preview/Editor Panel */}
          <div className="flex-1 min-w-0 bg-studio-bg">
            <PreviewPanel files={generatedFiles} isGenerating={isGenerating} />
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onAuthSuccess}
      />
    </div>
  );
}
