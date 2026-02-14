
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GeneratedCode } from '../types';
import { CodeIcon, EyeIcon, FileIcon } from './icons';

declare global {
    interface Window {
      hljs: any;
    }
}

const CodeEditor: React.FC<{ code: GeneratedCode }> = ({ code }) => {
  const [selectedFile, setSelectedFile] = useState<string>(Object.keys(code)[0] || '');
  const codeRef = useRef<HTMLElement>(null);

  const fileTree = Object.keys(code);
  
  useEffect(() => {
    // When a new file is generated, select the first one.
    const firstFile = Object.keys(code)[0];
    if (firstFile) {
      setSelectedFile(firstFile);
    }
  }, [code]);
  
  useEffect(() => {
    if (codeRef.current && window.hljs) {
      window.hljs.highlightElement(codeRef.current);
    }
  }, [selectedFile, code]);


  return (
    <div className="flex h-full bg-gray-900">
      <div className="w-48 bg-gray-800/50 border-r border-gray-700 p-2 overflow-y-auto">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-2 px-2">Files</h3>
        <ul>
          {fileTree.map(file => (
            <li key={file}>
              <button
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded flex items-center gap-2 ${
                  selectedFile === file ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FileIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{file}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow relative text-sm">
         <pre className="h-full w-full overflow-auto !bg-gray-900 font-mono">
            <code ref={codeRef} className={`language-${selectedFile.split('.').pop()} h-full block p-4`}>
                {code[selectedFile] || 'Select a file to view its content.'}
            </code>
        </pre>
      </div>
    </div>
  );
};

const LivePreview: React.FC<{ code: GeneratedCode }> = ({ code }) => {
    // FIX: Refactored logic to use a functional approach with `reduce`, creating new variables
    // instead of reassigning. This prevents a subtle TypeScript type inference issue that caused
    // the `never` type error on string methods like `.match()`.
    const srcDoc = useMemo(() => {
        const baseHtml = code['index.html'];
        if (!baseHtml) {
            return '<html><body>No index.html found.</body></html>';
        }

        // Find and replace local CSS links with style tags
        const cssLinks = baseHtml.match(/<link\s+.*?href="([^"]+)"[^>]*>/g) || [];
        const htmlWithCss = cssLinks.reduce((currentHtml, linkTag) => {
            const hrefMatch = linkTag.match(/href="([^"]+)"/);
            if (hrefMatch) {
                const href = hrefMatch[1];
                if (code[href] && !href.startsWith('http')) {
                    return currentHtml.replace(linkTag, `<style>${code[href]}</style>`);
                }
            }
            return currentHtml;
        }, baseHtml);
        
        // Find and replace local JS scripts with inline script tags
        const scriptTags = htmlWithCss.match(/<script\s+.*?src="([^"]+)"[^>]*><\/script>/g) || [];
        const finalHtml = scriptTags.reduce((currentHtml, scriptTag) => {
            const srcMatch = scriptTag.match(/src="([^"]+)"/);
            if (srcMatch) {
                const src = srcMatch[1];
                if (code[src] && !src.startsWith('http')) {
                    return currentHtml.replace(scriptTag, `<script>${code[src]}</script>`);
                }
            }
            return currentHtml;
        }, htmlWithCss);

        return finalHtml;
    }, [code]);

    return (
        <div className="h-full bg-white">
            <iframe
                srcDoc={srcDoc}
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin" // allow-same-origin is needed for some JS APIs
                className="w-full h-full border-none"
            />
        </div>
    );
};

// FIX: Added missing ResultPanelProps interface definition to resolve TypeScript error.
interface ResultPanelProps {
  code: GeneratedCode;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ code }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="flex-grow w-full md:w-1/2 flex flex-col bg-gray-900">
      <div className="flex-shrink-0 flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'preview'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-gray-400 hover:bg-gray-800'
          }`}
        >
          <EyeIcon className="h-4 w-4" />
          Preview
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'code'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-gray-400 hover:bg-gray-800'
          }`}
        >
          <CodeIcon className="h-4 w-4" />
          Code
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        {activeTab === 'preview' ? <LivePreview code={code} /> : <CodeEditor code={code} />}
      </div>
    </div>
  );
};
