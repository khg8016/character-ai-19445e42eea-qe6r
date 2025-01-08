import React from 'react';

export function Hero() {
  return (
    <div className="bg-emerald-900 dark:bg-emerald-950 py-8 sm:py-12 md:py-16 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3 sm:mb-4">
            Sprint
          </h1>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-300 max-w-2xl mx-auto px-4">
            Discover and acquire production-ready AI prototypes built by experts
          </p>
        </div>
      </div>
    </div>
  );
}