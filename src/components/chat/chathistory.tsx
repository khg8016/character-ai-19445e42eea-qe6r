import { useEffect, useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { Chat } from '../../types/database';
import { MessageCircle, Trash2 } from 'lucide-react';

interface ChatHistoryProps {
  characterId: string;
  onSelectChat: (chatId: string) => void;
  activeChatId: string | null;
}

export function ChatHistory({
  characterId,
  onSelectChat,
  activeChatId
}: ChatHistoryProps) {
  const { supabase } = useSupabase();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 채팅 목록 로드
  const loadChats = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: false });

    if (data) setChats(data);
  };

  // 채팅방 삭제
  const handleDeleteChat = async (chatId: string) => {
    if (!supabase || isDeleting) return;

    if (!window.confirm('이 대화를 삭제하시겠습니까?')) return;

    setIsDeleting(chatId);
    try {
      // 메시지 먼저 삭제
      await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId);

      // 채팅방 삭제
      await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      // 현재 활성화된 채팅방이 삭제된 경우 목록 새로고침
      if (activeChatId === chatId) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('채팅방을 삭제하는 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(null);
    }
  };

  // 초기 로드 및 실시간 업데이트 구독
  useEffect(() => {
    loadChats();

    if (!supabase || !characterId) return;

    // 실시간 채팅방 변경 구독
    const channel = supabase
      .channel(`character_chats:${characterId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE 모두 감지
          schema: 'public',
          table: 'chats',
          filter: `character_id=eq.${characterId}`,
        },
        () => {
          // 변경사항이 있을 때마다 채팅 목록 새로고침
          loadChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, characterId]);

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`relative group rounded-md hover:bg-gray-100 transition-colors
            ${activeChatId === chat.id ? 'bg-gray-100' : ''}`}
        >
          <div
            onClick={() => onSelectChat(chat.id)}
            className="w-full text-left px-3 py-2 cursor-pointer"
          >
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{chat.title}</span>
            </div>
            <span className="text-xs text-gray-500 block mt-1">
              {new Date(chat.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button
              onClick={() => handleDeleteChat(chat.id)}
              className={`p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDeleting === chat.id ? 'cursor-not-allowed' : ''}`}
              disabled={isDeleting === chat.id}
              title="대화 삭제"
            >
              <Trash2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}