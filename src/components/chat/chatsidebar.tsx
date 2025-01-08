import { MessageCircle, Plus } from 'lucide-react';
import { ChatHistory } from './ChatHistory';

interface ChatSidebarProps {
  character: {
    name: string;
    avatar_url: string | null;
  };
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  characterId: string;
  activeChatId: string | null;
}

export function ChatSidebar({
  character,
  onSelectChat,
  onNewChat,
  characterId,
  activeChatId
}: ChatSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={character.avatar_url || 'https://via.placeholder.com/40'}
            alt={character.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h2 className="text-lg font-medium text-gray-900">
              {character.name}
            </h2>
            <p className="text-sm text-gray-500">온라인</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 대화 시작
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          채팅 기록
        </h3>
        <ChatHistory
          characterId={characterId}
          onSelectChat={onSelectChat}
          activeChatId={activeChatId}
        />
      </div>
    </div>
  );
}