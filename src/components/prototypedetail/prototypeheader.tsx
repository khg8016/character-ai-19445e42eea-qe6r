import React from 'react';
import { Coins } from 'lucide-react';
import type { Prototype } from '../../types/prototype';

interface PrototypeHeaderProps {
  prototype: Prototype;
}

export function PrototypeHeader({ prototype }: PrototypeHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={prototype.author.avatar}
            alt={prototype.author.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-gray-600 dark:text-gray-400">{prototype.author.name}</span>
        </div>
        
        <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Coins className="w-5 h-5 text-emerald-500 mr-2" />
          {prototype.creditPrice} credits
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{prototype.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{prototype.description}</p>

      <div className="flex flex-wrap gap-2">
        {prototype.tags.map(tag => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}