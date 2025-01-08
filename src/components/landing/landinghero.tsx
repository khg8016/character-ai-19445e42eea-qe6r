import React from 'react';
import { Zap } from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-600/10">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">
                <span>Just shipped v1.0</span>
                <Zap className="h-4 w-4" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Launch your next fully-featured project in seconds
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Sprint helps you kickstart your projects with production-ready AI prototypes. Get started quickly and focus on what matters most.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <button
              onClick={onGetStarted}
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started
            </button>
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}