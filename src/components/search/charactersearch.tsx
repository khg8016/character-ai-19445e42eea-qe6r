import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { Character } from '../../types/database';
import { useNavigate } from 'react-router-dom';
import { ProfileImage } from '../common/ProfileImage';
import { useDebounce } from '../../hooks/useDebounce';

interface CharacterWithStats extends Character {
  character_stats: {
    chat_count: number;
    like_count: number;
  } | null;
}

export function CharacterSearch() {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CharacterWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchCharacters = async () => {
      if (!supabase || !debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('characters')
          .select(`
            *,
            character_stats (
              chat_count,
              like_count
            )
          `)
          .or(`name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(5);

        if (data) {
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchCharacters();
  }, [supabase, debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (characterId: string) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/chat/${characterId}`);
  };

  return (
    <div ref={containerRef} className="relative w-full sm:max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2 bg-[#25262b] border border-gray-700 rounded-lg 
            placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent"
          placeholder="캐릭터 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-500 hover:text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && (query || results.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-[#25262b] rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">검색 중...</div>
          ) : results.length > 0 ? (
            <ul className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {results.map((character) => (
                <li key={character.id}>
                  <button
                    onClick={() => handleSelect(character.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#2c2d32] transition-colors"
                  >
                    <ProfileImage
                      src={character.avatar_url}
                      alt={character.name}
                      size="sm"
                      className="rounded-full ring-2 ring-gray-800"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-white font-medium truncate">
                        {character.name}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {character.description}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-4 text-center text-gray-400">
              검색 결과가 없습니다
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}