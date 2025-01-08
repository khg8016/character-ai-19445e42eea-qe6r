import { StorageError } from './types';
import { STORAGE_CONFIG, ERROR_MESSAGES } from './constants';

export function validateFile(file: File): void {
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    throw new StorageError(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  if (!STORAGE_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new StorageError(ERROR_MESSAGES.INVALID_FILE_TYPE);
  }
}

export function validateImageUrl(url: string): void {
  if (!url) {
    throw new StorageError('Image URL is required');
  }

  try {
    new URL(url);
  } catch {
    throw new StorageError('Invalid image URL');
  }
}

export function validateUploadResponse(data: unknown, error: unknown): void {
  if (error) {
    throw new StorageError(
      error instanceof Error ? error.message : ERROR_MESSAGES.UPLOAD_FAILED
    );
  }
  if (!data) {
    throw new StorageError(ERROR_MESSAGES.UPLOAD_FAILED);
  }
}