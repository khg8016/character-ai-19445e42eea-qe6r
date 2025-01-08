import { supabase } from '../supabase';
import { validateImageUrl, validateUploadResponse } from './validation';
import { generateUniqueFileName, getDefaultUploadOptions } from './utils';
import { UploadOptions, UploadResult, StorageError } from './types';
import { fetchImageViaProxy } from './proxy';

export async function uploadImageFromUrl(
  imageUrl: string, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (!supabase) {
    throw new StorageError('Supabase client not initialized');
  }

  try {
    console.log('Validating image URL:', imageUrl);
    validateImageUrl(imageUrl);

    // Fetch image through proxy if it's a DALL-E URL
    const blob = imageUrl.includes('oaidalleapiprodscus') 
      ? await fetchImageViaProxy(imageUrl)
      : await fetch(imageUrl).then(res => res.blob());

    if (!blob.type.startsWith('image/')) {
      throw new StorageError('Invalid image format');
    }

    console.log('Image blob:', { type: blob.type, size: blob.size });

    const contentType = blob.type || 'image/png';
    const folder = options.folder || 'character-avatars';
    const extension = contentType.split('/')[1] || 'png';
    const fileName = generateUniqueFileName(folder, extension);

    console.log('Uploading to storage:', { fileName, contentType });

    // Upload to Supabase Storage with retries
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(fileName, blob, {
            ...getDefaultUploadOptions(contentType),
            ...options,
            cacheControl: '31536000' // 1 year cache
          });

        console.log('Upload response:', { data, error });
        validateUploadResponse(data, error);

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        console.log('Upload successful:', { publicUrl });

        return {
          url: publicUrl,
          path: fileName
        };
      } catch (error) {
        console.error(`Upload attempt ${attempts + 1} failed:`, error);
        attempts++;
        if (attempts === maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    throw new StorageError('Maximum upload attempts exceeded');
  } catch (error) {
    console.error('Storage upload error:', error);
    throw new StorageError(
      error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.',
      error
    );
  }
}