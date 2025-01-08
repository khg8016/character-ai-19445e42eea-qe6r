import { Link } from 'react-router-dom';
import { Brain, ChevronRight } from 'lucide-react';
import { CharacterCategory } from '../../types/database';

interface CategoryCardProps {
  category: CharacterCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="group bg-[#25262b] rounded-xl p-4 hover:bg-[#2c2d32] transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="h-12 w-12 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
            <Brain className="h-6 w-6" />
          </div>
          <h3 className="text-base font-medium text-white group-hover:text-blue-400 transition-colors mb-2">
            {category.name}
          </h3>
          <p className="text-sm text-gray-400">
            {category.description}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
      </div>
    </Link>
  );
}