import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSupabase } from '../hooks/useSupabase';
import { Character } from '../types/database';
import { useChat } from '../hooks/useChat';
import { MainLayout } from '../components/layouts/MainLayout';
import { ChatMessages } from '../components/chat/ChatMessages';
import { ChatInput } from '../components/chat/ChatInput';
import { CharacterProfile } from '../components/chat/CharacterProfile';

export function Chat() {
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();
  const chatIdFromUrl = searchParams.get('chat');
  const { supabase } = useSupabase();
  const [character, setCharacter] = useState<Character | null>(null);
  const [characterStats, setCharacterStats] = useState<{
    chat_count: number;
    like_count: number;
  } | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    isLoading,
    error,
    chatId,
    streamingMessage,
    loadChat,
    resetChat,
  } = useChat(characterId);

  // Load character data
  useEffect(() => {
    const loadCharacterData = async () => {
      if (!supabase || !characterId) return;

      const [characterResult, statsResult] = await Promise.all([
        supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .single(),
        supabase
          .from('character_stats')
          .select('chat_count, like_count')
          .eq('character_id', characterId)
          .single()
      ]);

      if (characterResult.data) setCharacter(characterResult.data);
      if (statsResult.data) setCharacterStats(statsResult.data);
    };

    loadCharacterData();
  }, [supabase, characterId]);

  // Handle chat loading based on URL parameters
  useEffect(() => {
    if (chatIdFromUrl) {
      loadChat(chatIdFromUrl);
    } else {
      resetChat();
    }
  }, [chatIdFromUrl, loadChat, resetChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  if (!character) return null;

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <CharacterProfile character={character} stats={characterStats} />
          
          {error && (
            <div className="bg-red-900/50 p-4 rounded-md">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <ChatMessages
            messages={messages}
            streamingMessage={streamingMessage}
            character={character}
            greetingMessage={!chatId ? character.greeting_message : undefined}
          />
          
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-[#25262b] border-t border-gray-800 px-6 py-6">
          <ChatInput
            message={newMessage}
            onMessageChange={setNewMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
}