import { useState, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { Message } from '../types/database';
import { generateStreamingResponse } from '../lib/chat';
import { useChatMessages } from './useChatMessages';
import { useChatInitializer } from './useChatInitializer';

interface StreamingMessage extends Omit<Message, 'id'> {
  id?: string;
}

export function useChat(characterId: string | undefined) {
  const { supabase } = useSupabase();
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage | null>(null);

  const {
    messages,
    setMessages,
    loadMessages,
    subscribeToMessages
  } = useChatMessages(supabase, chatId);

  const { initializeChat } = useChatInitializer(supabase, characterId);

  // Load existing chat
  const loadChat = useCallback(async (selectedChatId: string) => {
    if (!supabase) return;
    
    try {
      // Reset previous state
      setStreamingMessage(null);
      setError(null);
      
      // Verify chat exists and belongs to user
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('id', selectedChatId)
        .single();

      if (chatError || !chat) {
        throw new Error('채팅을 찾을 수 없습니다');
      }

      setChatId(selectedChatId);
      await loadMessages(selectedChatId);
      subscribeToMessages(selectedChatId);
    } catch (err) {
      console.error('Failed to load chat:', err);
      setError('채팅을 불러올 수 없습니다.');
      setChatId(null);
      setMessages([]);
    }
  }, [supabase, loadMessages, setMessages, subscribeToMessages]);

  // Reset chat state
  const resetChat = useCallback(() => {
    setChatId(null);
    setMessages([]);
    setStreamingMessage(null);
    setError(null);
  }, [setMessages]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!supabase || !characterId || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      let currentChatId = chatId;
      if (!currentChatId) {
        const result = await initializeChat(content);
        if (!result) throw new Error('Failed to create chat');
        
        currentChatId = result.chat.id;
        setChatId(result.chat.id);
        setMessages(result.messages || []);
        subscribeToMessages(result.chat.id);
      } else {
        // Check credits before sending message
        const { data: creditCheck } = await supabase.rpc('use_credits', {
          p_user_id: user.id,
          p_amount: 1,
          p_description: '메시지 전송'
        });

        if (!creditCheck) {
          throw new Error('크레딧이 부족합니다');
        }

        // Save user message
        const { data: userMessage, error: userMessageError } = await supabase
          .from('messages')
          .insert([{
            chat_id: currentChatId,
            content,
            is_from_character: false,
          }])
          .select()
          .single();

        if (userMessageError) throw userMessageError;
        setMessages(prev => [...prev, userMessage]);
      }

      // Generate AI response
      setStreamingMessage({
        chat_id: currentChatId,
        content: '',
        is_from_character: true,
        created_at: new Date().toISOString(),
      });

      const { data: character } = await supabase
        .from('characters')
        .select('name, description')
        .eq('id', characterId)
        .single();

      if (!character) throw new Error('Character not found');

      const response = await generateStreamingResponse(
        content,
        character.name,
        character.description,
        (token) => {
          setStreamingMessage(prev => prev ? {
            ...prev,
            content: prev.content + token
          } : null);
        }
      );

      // Save AI response
      const { data: aiMessage, error: aiMessageError } = await supabase
        .from('messages')
        .insert([{
          chat_id: currentChatId,
          content: response,
          is_from_character: true,
        }])
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;
      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessage(null);

    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message === '크레딧이 부족합니다' 
        ? '크레딧이 부족합니다. 크레딧을 충전해주세요.'
        : '메시지를 전송할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, chatId, characterId, isLoading, initializeChat, setMessages, subscribeToMessages]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    chatId,
    streamingMessage,
    loadChat,
    resetChat,
  };
}