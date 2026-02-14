
import React, { useCallback } from 'react';
import { UploadedFile } from '../types';
import { UploadCloudIcon } from './icons';

interface FileUploaderProps {
  onFileUpload: (files: UploadedFile[]) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
    };
    reader.onerror = error => reject(error);
  });
};

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      const uploadedFiles: UploadedFile[] = await Promise.all(
        // FIX: Explicitly type `file` as `File` to resolve TypeScript errors.
        fileList.map(async (file: File) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          content: await fileToBase64(file),
        }))
      );
      onFileUpload(uploadedFiles);
    }
  }, [onFileUpload]);

  return (
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
       <UploadCloudIcon className="mx-auto h-8 w-8 text-gray-500" />
      <label htmlFor="file-upload" className="mt-2 text-sm text-gray-400">
        <span className="font-semibold text-cyan-400 cursor-pointer hover:underline">Click to upload</span> or drag and drop
      </label>
      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
       <p className="text-xs text-gray-500 mt-1">Text, images, etc.</p>
    </div>
  );
};
