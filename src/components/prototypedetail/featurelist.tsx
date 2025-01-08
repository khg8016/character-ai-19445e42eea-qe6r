import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface FeatureListProps {
  features: string[];
}

export function FeatureList({ features }: FeatureListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
        <span className="text-blue-600 dark:text-blue-500 mr-2">⚡</span> Key Features
      </h2>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}