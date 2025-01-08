import React from 'react';

interface GettingStartedProps {
  steps: string[];
}

export function GettingStarted({ steps }: GettingStartedProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
        <span className="text-blue-600 dark:text-blue-500 mr-2">🚀</span> Getting Started
      </h2>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
              {index + 1}
            </span>
            <span className="text-gray-700 dark:text-gray-300 pt-1">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}