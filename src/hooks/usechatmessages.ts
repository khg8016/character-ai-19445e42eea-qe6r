import { useState, useCallback, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Message } from '../types/database';

export function useChatMessages(supabase: SupabaseClient | null, chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages for a chat
  const loadMessages = useCallback(async (currentChatId: string) => {
    if (!supabase) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', currentChatId)
        .order('created_at', { ascending: true });

      if (loadError) throw loadError;
      if (data) setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('메시지를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Subscribe to real-time message updates
  const subscribeToMessages = useCallback((currentChatId: string) => {
    if (!supabase) return;

    const channel = supabase
      .channel(`chat:${currentChatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${currentChatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicate messages
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      loadMessages(chatId);
    } else {
      setMessages([]);
    }
  }, [chatId, loadMessages]);

  return {
    messages,
    setMessages,
    isLoading,
    error,
    loadMessages,
    subscribeToMessages
  };
}