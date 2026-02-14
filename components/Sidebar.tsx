
import React from 'react';
import { UploadedFile } from '../types';
import { FileUploader } from './FileUploader';
import { PlusIcon, FileTextIcon } from './icons';

interface SidebarProps {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ uploadedFiles, setUploadedFiles }) => {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 p-4 flex-col hidden md:flex">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Projects</h2>
        <button className="text-gray-400 hover:text-white">
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="bg-gray-800/50 rounded p-2 text-sm font-medium text-cyan-400 border border-cyan-500/30 cursor-pointer">
        My Awesome Website
      </div>

      <div className="mt-6 flex-grow flex flex-col overflow-hidden">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Context Files
        </h2>
        <FileUploader onFileUpload={setUploadedFiles} />
        <div className="mt-3 flex-grow overflow-y-auto space-y-2 pr-1">
          {uploadedFiles.length === 0 && (
             <p className="text-xs text-gray-500 text-center mt-4">Upload files to provide context to the AI.</p>
          )}
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded bg-gray-800/50">
              <FileTextIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div className="flex-grow overflow-hidden">
                <p className="text-xs font-medium text-gray-200 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
