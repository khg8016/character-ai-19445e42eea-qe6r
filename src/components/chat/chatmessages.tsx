import { Message } from '../../types/database';
import { MessageBubble } from '../MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  streamingMessage: Message | null;
  character: {
    name: string;
    avatar_url: string | null;
  };
  greetingMessage?: string;
}

export function ChatMessages({
  messages,
  streamingMessage,
  character,
  greetingMessage
}: ChatMessagesProps) {
  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      {greetingMessage && (
        <MessageBubble
          message={{
            id: 'greeting',
            chat_id: '',
            content: greetingMessage,
            is_from_character: true,
            created_at: new Date().toISOString(),
          }}
          character={character}
        />
      )}

      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          character={message.is_from_character ? character : null}
        />
      ))}
      
      {streamingMessage && (
        <MessageBubble 
          message={streamingMessage} 
          character={character}
        />
      )}
    </div>
  );
}