
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons';

interface PromptInputProps {
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSendMessage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSendMessage(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the website you want to build..."
        rows={1}
        className="w-full bg-gray-700/80 border border-gray-600 rounded-lg py-3 pl-4 pr-12 text-sm text-gray-100 placeholder-gray-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none block"
        disabled={isLoading}
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
      >
        <SendIcon className="h-4 w-4" />
      </button>
    </form>
  );
};
