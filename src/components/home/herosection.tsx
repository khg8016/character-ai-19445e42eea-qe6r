import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <div className="bg-[#1a1b1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <h1 className="text-3xl font-bold mb-3 text-white">
              무엇을 하시겠어요?
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              창의력을 키우세요
            </p>
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-[#25262b] text-white rounded-lg
                  border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-500"
                placeholder="캐릭터 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/characters/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 rounded-lg text-lg font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              만들기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}