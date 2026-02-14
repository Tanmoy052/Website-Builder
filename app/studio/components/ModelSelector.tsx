"use client";

import React from "react";
import { ChevronDown, Cpu } from "lucide-react";
import { AIModel } from "@/lib/ai/types";

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const models: { id: AIModel; name: string; description: string }[] = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Fast and capable",
  },
  { id: "gpt-4o", name: "GPT-4o", description: "Advanced reasoning" },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    description: "Open-weights powerhouse",
  },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors border border-studio-border">
        <Cpu size={16} className="text-studio-accent" />
        <span className="text-sm font-medium">
          {models.find((m) => m.id === selectedModel)?.name}
        </span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-studio-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`w-full text-left p-2 rounded-md hover:bg-studio-bg transition-colors ${
                selectedModel === model.id ? "bg-blue-50 border-blue-100" : ""
              }`}
            >
              <div className="text-sm font-semibold">{model.name}</div>
              <div className="text-xs text-gray-500">{model.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
