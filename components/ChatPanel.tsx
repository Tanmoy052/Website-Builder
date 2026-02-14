
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { PromptInput } from './PromptInput';
import { BotIcon, UserIcon } from './icons';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (prompt: string) => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

const RegenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M3 21v-5h5" />
    </svg>
);


export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, onRegenerate, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIndex = messages.map(m => m.role).lastIndexOf('assistant');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow w-full md:w-1/2 flex flex-col bg-gray-800/60 border-r border-gray-700">
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index}>
                <div className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <BotIcon className="h-5 w-5 text-white" />
                    </div>
                )}
                <div className={`max-w-xl p-4 rounded-lg shadow-md ${
                    message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                    </div>
                )}
                </div>
                 {index === lastAssistantMessageIndex && !isLoading && (
                    <div className="flex justify-start pl-12 pt-2">
                         <button 
                            onClick={onRegenerate}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                         >
                            <RegenerateIcon className="h-3 w-3" />
                            Regenerate
                        </button>
                    </div>
                )}
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-4 justify-start">
               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <BotIcon className="h-5 w-5 text-white" />
                </div>
               <div className="max-w-xl p-4 rounded-lg shadow-md bg-gray-700 text-gray-200 rounded-bl-none">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></div>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-gray-800 border-t border-gray-700">
        <PromptInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};