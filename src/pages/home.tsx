import { useEffect, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { CharacterCategory } from '../types/database';
import { MainLayout } from '../components/layouts/MainLayout';
import { PopularCharactersSection } from '../components/home/PopularCharactersSection';
import { CategorySection } from '../components/home/CategorySection';

export function Home() {
  const { supabase } = useSupabase();
  const [categories, setCategories] = useState<CharacterCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      if (!supabase) return;

      const { data } = await supabase
        .from('character_categories')
        .select('*');

      if (data) setCategories(data);
    };

    loadCategories();
  }, [supabase]);

  return (
    <MainLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showSearch={true}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 인기 캐릭터 섹션 */}
        <PopularCharactersSection searchQuery={searchQuery} />

        {/* 검색 중이 아닐 때만 카테고리 섹션 표시 */}
        {!searchQuery && <CategorySection categories={categories} />}
      </div>
    </MainLayout>
  );
}