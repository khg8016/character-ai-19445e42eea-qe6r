import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../hooks/useSupabase';
import { MainLayout } from '../components/layouts/MainLayout';
import { CharacterForm } from '../components/form/CharacterForm';
import type { CharacterFormData } from '../components/form/CharacterForm';

export function CreateCharacter() {
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: CharacterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data: character, error: insertError } = await supabase
        .from('characters')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            avatar_url: formData.avatarUrl,
            greeting_message: formData.greetingMessage,
            category_id: formData.categoryId,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Initialize character stats
      await supabase.from('character_stats').insert([
        {
          character_id: character.id,
          chat_count: 0,
          like_count: 0,
        },
      ]);

      navigate(`/chat/${character.id}`);
    } catch (err) {
      setError('캐릭터 생성 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#25262b] rounded-xl p-6 mb-6">
          <h1 className="text-xl font-bold text-white mb-2">새 캐릭터 만들기</h1>
          <p className="text-gray-400 text-sm">
            나만의 AI 캐릭터를 만들어보세요. 캐릭터의 특성과 성격을 설정하고,
            대화를 시작해보세요.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 p-4 rounded-xl mb-6">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-[#25262b] rounded-xl p-6">
          <CharacterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </MainLayout>
  );
}