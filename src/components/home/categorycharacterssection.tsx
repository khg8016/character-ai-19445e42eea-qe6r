import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { Character, CharacterCategory } from '../../types/database';
import { CharacterCard } from './CharacterCard';

interface CategoryCharactersSectionProps {
  category: CharacterCategory;
}

interface CharacterWithStats extends Character {
  character_stats: {
    chat_count: number;
    like_count: number;
  } | null;
}

export function CategoryCharactersSection({ category }: CategoryCharactersSectionProps) {
  const { supabase } = useSupabase();
  const [characters, setCharacters] = useState<CharacterWithStats[]>([]);

  useEffect(() => {
    const loadCharacters = async () => {
      if (!supabase) return;

      // 대화 수가 많은 순으로 정렬하되, character_stats가 있는 캐릭터만 가져옴
      const { data } = await supabase
        .from('characters')
        .select(`
          *,
          character_stats (
            chat_count,
            like_count
          )
        `)
        .eq('category_id', category.id)
        .not('character_stats', 'is', null)
        .order('chat_count', { foreignTable: 'character_stats', ascending: false })
        .limit(4);

      if (data) {
        // character_stats가 있는 캐릭터만 필터링
        const charactersWithStats = data.filter(char => char.character_stats);
        setCharacters(charactersWithStats);
      }
    };

    loadCharacters();
  }, [supabase, category.id]);

  if (characters.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{category.name}</h2>
          <p className="text-sm text-gray-400 mt-1">{category.description}</p>
        </div>
        <Link
          to={`/categories/${category.id}`}
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}