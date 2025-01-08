export function createImagePrompt(basePrompt: string): string {
  return `Professional digital portrait of a person representing ${basePrompt}. 
    High quality, realistic, detailed, professional photography style. 
    Safe for work, appropriate content only.`.trim();
}