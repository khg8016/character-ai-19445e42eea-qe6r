export function generateUniqueFileName(folder: string, extension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${folder}/${timestamp}-${random}.${extension}`;
}

export function getDefaultUploadOptions(contentType: string): {
  contentType: string;
  cacheControl: string;
  upsert: boolean;
} {
  return {
    contentType,
    cacheControl: '3600',
    upsert: false
  };
}