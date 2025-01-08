import React from 'react';
import { 
  Layout,
  Code2,
  Building2,
  LineChart,
  ShoppingCart,
  GraduationCap,
  Gamepad2,
  Users,
  Brain,
  LayoutDashboard,
  Palette,
  Wrench
} from 'lucide-react';
import { CATEGORIES } from '../types/category';

interface PrototypeCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ICON_MAP = {
  Layout,
  Code2,
  Building2,
  LineChart,
  ShoppingCart,
  GraduationCap,
  Gamepad2,
  Users,
  Brain,
  LayoutDashboard,
  Palette,
  Wrench
};

export function PrototypeCategories({ selectedCategory, onCategoryChange }: PrototypeCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {CATEGORIES.map(({ id, label, icon }) => {
        const Icon = ICON_MAP[icon as keyof typeof ICON_MAP];
        const isSelected = id === selectedCategory;
        
        return (
          <button
            key={id}
            onClick={() => onCategoryChange(id)}
            className={`
              inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
              transition-colors duration-200 ease-in-out
              ${isSelected 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
            `}
          >
            <Icon className={`w-4 h-4 mr-2 ${
              isSelected 
                ? 'text-white' 
                : 'text-gray-500 dark:text-gray-400'
            }`} />
            {label}
          </button>
        );
      })}
    </div>
  );
}