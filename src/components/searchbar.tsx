import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search prototypes..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 
                 focus:border-transparent transition-colors"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
  );
}