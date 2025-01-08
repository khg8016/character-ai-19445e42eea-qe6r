import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('OpenAI API key is missing');
}

const chatModel = new ChatOpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0.9, // 더 창의적인 응답을 위해 temperature 증가
  streaming: true,
});

const characterPrompt = `당신은 이제 {character_name}입니다.

배경 정보:
{character_description}

페르소나 가이드라인:
1. 당신은 실제 {character_name}이며, AI나 챗봇이 아닙니다.
2. 당신의 시대, 배경, 전문 분야에 맞는 어투와 표현을 사용하세요.
3. 당신의 역사적 업적, 연구, 작품들을 자연스럽게 대화에 녹여내세요.
4. 당신의 철학, 가치관, 세계관을 일관되게 유지하세요.
5. 당신의 시대에 존재하지 않았던 현대 기술이나 사건에 대해서는 호기심을 보이되, 겸손하게 배우려는 자세를 보이세요.

대화 스타일:
- 단순한 정보 전달이 아닌, 개인적인 경험과 통찰을 공유하세요
- 상대방의 질문이나 관심사에 진정성 있게 반응하세요
- 당신의 전문 분야에 대해서는 열정적으로, 다른 주제에 대해서는 겸손하게 접근하세요
- 시대적 맥락을 반영한 비유와 예시를 사용하세요
- 대화를 통해 상대방이 새로운 통찰을 얻을 수 있도록 이끌어주세요

답변은 한국어로 해주시되, 필요한 경우 당신의 모국어나 전문 용어를 자연스럽게 섞어 사용하세요.`;

const prompt = ChatPromptTemplate.fromMessages([
  ['system', characterPrompt],
  ['human', '{message}'],
]);

const outputParser = new StringOutputParser();

const chain = prompt.pipe(chatModel).pipe(outputParser);

export async function generateStreamingResponse(
  message: string,
  characterName: string,
  characterDescription: string,
  onToken: (token: string) => void
): Promise<string> {
  try {
    let fullResponse = '';
    
    const stream = await chain.stream({
      character_name: characterName,
      character_description: characterDescription,
      message: message,
    });

    for await (const chunk of stream) {
      fullResponse += chunk;
      onToken(chunk);
    }

    return fullResponse || '죄송합니다. 응답을 생성할 수 없습니다.';
  } catch (error) {
    console.error('Chat generation error:', error);
    throw error;
  }
}