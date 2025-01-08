import React, { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { uploadPrototypeImage } from '../../utils/prototype';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export function ImageUpload({ currentImageUrl, onUploadSuccess }: ImageUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or WebP image');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }

      setUploading(true);
      const url = await uploadPrototypeImage(file, user.id);
      onUploadSuccess(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Prototype preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImagePlus className="w-12 h-12" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-600 text-white 
                   hover:bg-blue-700 disabled:opacity-50 transition-colors"
          aria-label="Upload image"
        >
          <ImagePlus className="w-4 h-4" />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Prototype image upload"
      />
      {uploading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Uploading image...
        </p>
      )}
    </div>
  );
}