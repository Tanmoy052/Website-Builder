"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Paperclip, RefreshCw, Download } from "lucide-react";
import { ChatMessage } from "@/lib/ai/types";

interface ChatPanelProps {
  onSendMessage: (content: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onSendMessage,
  messages,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          onSendMessage(`[Uploaded File: ${file.name}]`);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-studio-accent">
              <Bot size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome to AI Studio</h2>
              <p className="text-gray-500 max-w-md mt-2">
                I can help you build full-stack websites, write code, or just
                chat. What are we building today?
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-100 text-studio-accent"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-studio-accent text-white"
                    : "bg-gray-50 border border-studio-border text-gray-800"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>

                {msg.role === "assistant" && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                      title="Download Source"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-studio-accent flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-gray-50 border border-studio-border p-4 rounded-2xl flex gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-studio-border">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the website you want to build..."
            className="w-full p-4 pr-24 border border-studio-border rounded-xl focus:ring-2 focus:ring-studio-accent focus:border-transparent resize-none h-32"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-studio-accent transition-colors"
            >
              <Paperclip size={20} />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-lg transition-colors ${
                input.trim() && !isLoading
                  ? "bg-studio-accent text-white shadow-md"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        <div className="mt-2 text-[10px] text-gray-400 text-center">
          AI may produce inaccurate information about people, places, or facts.
        </div>
      </div>
    </div>
  );
};
