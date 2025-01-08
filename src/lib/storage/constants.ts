export const STORAGE_CONFIG = {
  BUCKET: 'avatars',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  DEFAULT_CACHE_CONTROL: '31536000', // 1 year
} as const;

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: '파일 크기는 5MB를 초과할 수 없습니다.',
  INVALID_FILE_TYPE: '지원하지 않는 파일 형식입니다.',
  UPLOAD_FAILED: '이미지 업로드에 실패했습니다.',
  FETCH_FAILED: '이미지를 가져오는데 실패했습니다.',
  MAX_RETRIES_EXCEEDED: '최대 재시도 횟수를 초과했습니다.',
} as const;