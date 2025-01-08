import React, { useRef, useState } from 'react';
import { FileUp } from 'lucide-react';
import { uploadSourceCode } from '../../utils/sourceCode';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';

interface SourceCodeUploadProps {
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export function SourceCodeUpload({ currentUrl, onUploadSuccess }: SourceCodeUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      // Validate file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'zip') {
        toast.error('Please upload a ZIP file');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File must be less than 10MB');
        return;
      }

      setUploading(true);
      const url = await uploadSourceCode(file, user.id);
      onUploadSuccess(url);
      toast.success('Source code uploaded successfully');
    } catch (error) {
      console.error('Error uploading source code:', error);
      toast.error('Failed to upload source code. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Source Code (ZIP)
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload your source code as a ZIP file (max 10MB)
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 
                   rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 
                   bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                   disabled:opacity-50"
        >
          <FileUp className="w-4 h-4 mr-2" />
          Upload ZIP
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {currentUrl && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current file: <a href={currentUrl} className="text-blue-600 hover:underline">Download ZIP</a>
        </div>
      )}
      
      {uploading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Uploading source code...
        </p>
      )}
    </div>
  );
}