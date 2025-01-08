import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase } from '../hooks/useSupabase';
import { Character, CharacterCategory } from '../types/database';
import { MainLayout } from '../components/layouts/MainLayout';
import { CharacterCard } from '../components/home/CharacterCard';

interface CharacterWithStats extends Character {
  character_stats: {
    chat_count: number;
    like_count: number;
  } | null;
}

export function CategoryCharacters() {
  const { categoryId } = useParams();
  const { supabase } = useSupabase();
  const [characters, setCharacters] = useState<CharacterWithStats[]>([]);
  const [category, setCategory] = useState<CharacterCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!supabase || !categoryId) return;

      const [charactersResult, categoryResult] = await Promise.all([
        supabase
          .from('characters')
          .select(`
            *,
            character_stats!inner (
              chat_count,
              like_count
            )
          `)
          .eq('category_id', categoryId)
          .order('chat_count', { foreignTable: 'character_stats', ascending: false }),
        supabase
          .from('character_categories')
          .select('*')
          .eq('id', categoryId)
          .single()
      ]);

      if (charactersResult.data) {
        setCharacters(charactersResult.data);
      }
      if (categoryResult.data) {
        setCategory(categoryResult.data);
      }
    };

    loadData();
  }, [supabase, categoryId]);

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showSearch={true}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {category?.name}
          </h1>
          <p className="text-gray-400">
            {category?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              이 카테고리에 캐릭터가 없습니다.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}