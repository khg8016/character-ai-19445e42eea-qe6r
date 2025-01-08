import { useEffect, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { Chat } from '../types/database';
import { MessageCircle } from 'lucide-react';

interface ChatHistoryProps {
  characterId: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatHistory({ characterId, onSelectChat }: ChatHistoryProps) {
  const { supabase } = useSupabase();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const loadChats = async () => {
      if (!supabase) return;

      const { data } = await supabase
        .from('chats')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (data) setChats(data);
    };

    loadChats();
  }, [supabase, characterId]);

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-700 truncate">{chat.title}</span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(chat.created_at).toLocaleDateString()}
          </span>
        </button>
      ))}
    </div>
  );
}