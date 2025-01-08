import { useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

export function useChatInitializer(supabase: SupabaseClient | null, characterId: string | undefined) {
  const initializeChat = useCallback(async (userMessage: string) => {
    if (!supabase || !characterId) return null;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Check credits first
      const { data: creditCheck } = await supabase.rpc('use_credits', {
        p_user_id: user.id,
        p_amount: 1,
        p_description: '새 대화 시작'
      });

      if (!creditCheck) {
        throw new Error('크레딧이 부족합니다');
      }

      // Get character info
      const { data: character } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (!character) throw new Error('Character not found');

      // Create new chat
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert([{
          character_id: characterId,
          user_id: user.id,
          title: `${character.name}와의 대화`,
        }])
        .select()
        .single();

      if (chatError) throw chatError;

      // Save greeting and user message
      const { data: initialMessages, error: messagesError } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chat.id,
            content: character.greeting_message,
            is_from_character: true,
          },
          {
            chat_id: chat.id,
            content: userMessage,
            is_from_character: false,
          }
        ])
        .select();

      if (messagesError) throw messagesError;

      // Increment chat count
      await supabase.rpc('increment_chat_count', { char_id: characterId });

      return { chat, messages: initialMessages };
    } catch (err) {
      console.error('Failed to initialize chat:', err);
      throw err;
    }
  }, [supabase, characterId]);

  return { initializeChat };
}