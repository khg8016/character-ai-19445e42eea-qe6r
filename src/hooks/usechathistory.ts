import { useState, useEffect, useCallback, useRef } from 'react';
import { useSupabase } from './useSupabase';

interface ChatHistory {
  id: string;
  title: string;
  created_at: string;
  character: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export function useChatHistory() {
  const { supabase } = useSupabase();
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);

  const loadChats = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('chats')
        .select(`
          id,
          title,
          created_at,
          character:characters (
            id,
            name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setChats(data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // 초기 로드 및 실시간 구독 설정
  useEffect(() => {
    if (!supabase || initialized.current) return;

    // 초기 데이터 로드
    setLoading(true);
    loadChats();
    initialized.current = true;

    // 실시간 구독 설정
    const channel = supabase
      .channel('chat_history')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats'
        },
        async () => {
          // 변경사항이 있을 때만 데이터 다시 로드
          await loadChats();
        }
      )
      .subscribe();

    // 클린업
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, loadChats]);

  return { chats, loading };
}