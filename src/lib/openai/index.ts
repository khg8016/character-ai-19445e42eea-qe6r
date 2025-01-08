import OpenAI from 'openai';
import { createImagePrompt } from './prompts';
import { ImageGenerationOptions, OpenAIError } from './types';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('OpenAI API key is missing');
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateImage(
  prompt: string,
  options: ImageGenerationOptions = {}
): Promise<string> {
  try {
    const safePrompt = createImagePrompt(prompt);
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: safePrompt,
      n: 1,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
      style: options.style || "natural"
    });

    if (!response.data?.[0]?.url) {
      throw new OpenAIError('이미지 URL을 받지 못했습니다');
    }

    return response.data[0].url;

  } catch (error: any) {
    console.error('OpenAI Image Generation Error:', error);
    
    if (error.code === 'content_policy_violation') {
      throw new OpenAIError('이미지 생성이 정책에 위배됩니다. 다른 설명을 시도해주세요.');
    }
    
    if (error instanceof OpenAIError) {
      throw error;
    }
    
    throw new OpenAIError('이미지 생성에 실패했습니다. 다시 시도해주세요.', error);
  }
}

export { OpenAIError } from './types';
export type { ImageGenerationOptions } from './types';