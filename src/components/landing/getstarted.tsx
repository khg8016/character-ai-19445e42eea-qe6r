import React from 'react';
import { ArrowRight } from 'lucide-react';

interface GetStartedProps {
  onGetStarted: () => void;
}

export function GetStarted({ onGetStarted }: GetStartedProps) {
  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Ready to get started?
          <br />
          Start building with Sprint today.
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <button
            onClick={onGetStarted}
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Get started
          </button>
          <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            Learn more <ArrowRight className="inline h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}