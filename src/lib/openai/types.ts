export interface ImageGenerationOptions {
  size?: '1024x1024' | '512x512' | '256x256';
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'vivid';
}

export class OpenAIError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'OpenAIError';
  }
}