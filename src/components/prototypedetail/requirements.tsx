import React from 'react';
import { CircleDot } from 'lucide-react';

interface RequirementsProps {
  requirements: string[];
}

export function Requirements({ requirements }: RequirementsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
        <span className="text-blue-600 dark:text-blue-500 mr-2">🎯</span> Requirements
      </h2>
      <ul className="space-y-4">
        {requirements.map((requirement, index) => (
          <li key={index} className="flex items-start">
            <CircleDot className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0 mt-1" />
            <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}