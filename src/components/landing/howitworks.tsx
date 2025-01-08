import React from 'react';
import { Search, Eye, Settings2, Users } from 'lucide-react';

const steps = [
  {
    title: 'Search',
    description: 'Find production-ready AI prototypes in our curated marketplace.',
    icon: Search,
  },
  {
    title: 'Preview',
    description: 'Founders can preview and evaluate prototypes before purchase.',
    icon: Eye,
  },
  {
    title: 'Customize',
    description: 'Customize the prototype yourself or work with our expert community.',
    icon: Settings2,
  },
  {
    title: 'Hire',
    description: 'Connect with expert developers for customization and implementation.',
    icon: Users,
  },
];

export function HowItWorks() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            How It Works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            From Search to Production
          </p>
        </div>
        <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <step.icon 
                    className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" 
                    aria-hidden="true" 
                  />
                  {step.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}