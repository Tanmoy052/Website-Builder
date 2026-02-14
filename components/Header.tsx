
import React from 'react';
import { AIModel } from '../types';
import { LogoIcon, DownloadIcon } from './icons';

interface HeaderProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedModel, onModelChange, onDownload }) => {
  return (
    <header className="flex-shrink-0 bg-gray-800/50 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-7 w-7 text-cyan-400" />
        <h1 className="text-lg font-semibold text-gray-100">AI Website Builder</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as AIModel)}
            className="bg-gray-700 border border-gray-600 rounded-md pl-3 pr-8 py-1.5 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none"
          >
            {/* FIX: Removed unsupported Gemini model and disabled non-implemented models for better UX. */}
            <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
            <option value="gpt-4-turbo" disabled>GPT-4 Turbo (Soon)</option>
            <option value="claude-3-opus" disabled>Claude 3 Opus (Soon)</option>
            <option value="deepseek-coder" disabled>DeepSeek Coder (Soon)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          </div>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors"
        >
          <DownloadIcon className="h-4 w-4" />
          <span>Download ZIP</span>
        </button>
      </div>
    </header>
  );
};
