"use client";

import React, { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Download,
  ExternalLink,
  Code,
  FileCode,
  CheckCircle2,
} from "lucide-react";

interface PreviewPanelProps {
  files: { path: string; content: string }[];
  isGenerating: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files = [],
  isGenerating,
}) => {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const getPreviewContent = () => {
    const indexFile = files.find((f) => f.path === "index.html");
    if (!indexFile) {
      return "No preview available";
    }
    return indexFile.content;
  };

  const handleExportZip = async () => {
    if (!files || files.length === 0) return;
    try {
      const response = await fetch("/api/export-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "website-project.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export ZIP:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-studio-bg border-l border-studio-border">
      {/* Header */}
      <div className="h-14 bg-white border-b border-studio-border flex items-center justify-between px-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "preview"
                ? "bg-white shadow-sm text-studio-accent"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "code"
                ? "bg-white shadow-sm text-studio-accent"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Code
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border-r border-studio-border pr-4 mr-2">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded ${viewMode === "desktop" ? "bg-blue-50 text-studio-accent" : "text-gray-400"}`}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setViewMode("tablet")}
              className={`p-1.5 rounded ${viewMode === "tablet" ? "bg-blue-50 text-studio-accent" : "text-gray-400"}`}
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded ${viewMode === "mobile" ? "bg-blue-50 text-studio-accent" : "text-gray-400"}`}
            >
              <Smartphone size={16} />
            </button>
          </div>

          <button
            onClick={handleExportZip}
            disabled={!files || files.length === 0}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
              files && files.length > 0
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Download size={14} />
            <span>Export ZIP</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-studio-accent border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-medium text-gray-700">
              Architecting your website...
            </div>
          </div>
        )}

        {activeTab === "preview" ? (
          <div className="h-full p-8 flex justify-center">
            <div
              className={`bg-white shadow-2xl border border-studio-border rounded-xl overflow-hidden transition-all duration-300 ${
                viewMode === "desktop"
                  ? "w-full max-w-5xl"
                  : viewMode === "tablet"
                    ? "w-[768px]"
                    : "w-[375px]"
              }`}
            >
              <div className="h-8 bg-gray-50 border-b border-studio-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 h-5 bg-white border border-gray-200 rounded flex items-center px-2 text-[10px] text-gray-400">
                  localhost:3000
                </div>
                <ExternalLink size={12} className="text-gray-400" />
              </div>
              <iframe
                className="w-full h-[calc(100%-32px)]"
                srcDoc={getPreviewContent()}
                title="Website Preview"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex">
            {/* File Explorer */}
            <div className="w-64 bg-gray-50 border-r border-studio-border overflow-y-auto">
              <div className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Project Files
              </div>
              {files &&
                files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
                      selectedFileIndex === idx
                        ? "bg-white text-studio-accent border-r-2 border-studio-accent"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FileCode size={14} />
                    <span className="truncate">{file.path}</span>
                  </button>
                ))}
            </div>
            {/* Code Editor */}
            <div className="flex-1 bg-white overflow-hidden flex flex-col">
              <div className="h-10 bg-gray-50 border-b border-studio-border flex items-center px-4 justify-between">
                <span className="text-xs font-mono text-gray-500">
                  {files && files[selectedFileIndex]?.path}
                </span>
                <CheckCircle2 size={14} className="text-green-500" />
              </div>
              <pre className="flex-1 p-6 overflow-auto font-mono text-sm bg-gray-900 text-gray-100">
                <code>{files && files[selectedFileIndex]?.content}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
