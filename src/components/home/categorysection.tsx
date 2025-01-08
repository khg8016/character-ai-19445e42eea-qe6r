import { Link } from 'react-router-dom';
import { Brain, ChevronRight } from 'lucide-react';
import { CharacterCategory } from '../../types/database';
import { CategoryCard } from './CategoryCard';

interface CategorySectionProps {
  categories: CharacterCategory[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">다음을 시도해 보세요</h2>
          <p className="text-sm text-gray-400 mt-1">
            새로운 경험을 시작해보세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}