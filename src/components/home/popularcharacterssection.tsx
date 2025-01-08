import { useState, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { Character } from '../../types/database';
import { CharacterCard } from './CharacterCard';
import { Trophy } from 'lucide-react';

interface CharacterWithStats extends Character {
  character_stats: {
    chat_count: number;
    like_count: number;
  };
}

interface PopularCharactersSectionProps {
  searchQuery?: string;
}

export function PopularCharactersSection({ searchQuery = '' }: PopularCharactersSectionProps) {
  const { supabase } = useSupabase();
  const [characters, setCharacters] = useState<CharacterWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      if (!supabase) return;
      setIsLoading(true);

      try {
        const { data } = await supabase
          .from('character_stats')
          .select(`
            chat_count,
            like_count,
            characters (
              id,
              name,
              description,
              avatar_url,
              greeting_message,
              category_id,
              created_by,
              created_at,
              updated_at
            )
          `)
          .order('chat_count', { ascending: false })
          .limit(8);

        if (data) {
          const formattedCharacters = data
            .filter(stat => stat.characters)
            .map(stat => ({
              ...stat.characters,
              character_stats: {
                chat_count: stat.chat_count,
                like_count: stat.like_count
              }
            })) as CharacterWithStats[];

          setCharacters(formattedCharacters);
        }
      } catch (error) {
        console.error('Failed to load popular characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, [supabase]);

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-yellow-600/20 text-yellow-400 flex items-center justify-center">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">인기 캐릭터</h2>
            <p className="text-sm text-gray-400 mt-1">
              가장 많은 대화를 나눈 캐릭터
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#25262b] rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2c2d32] rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-[#2c2d32] rounded w-24 mb-2" />
                  <div className="h-3 bg-[#2c2d32] rounded w-16" />
                </div>
              </div>
              <div className="mt-3 h-12 bg-[#2c2d32] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredCharacters.length === 0) {
    return (
      <div className="mb-12 text-center py-12">
        <p className="text-gray-400">
          {searchQuery ? '검색 결과가 없습니다.' : '캐릭터가 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-yellow-600/20 text-yellow-400 flex items-center justify-center">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {searchQuery ? '검색 결과' : '인기 캐릭터'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery ? `'${searchQuery}'에 대한 검색 결과입니다` : '가장 많은 대화를 나눈 캐릭터'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCharacters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}