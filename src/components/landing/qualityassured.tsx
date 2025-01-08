import React from 'react';
import { Box, Code2, Shield, Users } from 'lucide-react';

const features = [
  {
    title: 'Verified AI Agentic Prototypes',
    description: 'Curated collection of production-ready AI prototypes that are immediately deployable to market. Each prototype is thoroughly tested and validated for real-world applications.',
    icon: Box,
  },
  {
    title: 'AI Agent Compatible',
    description: 'All prototypes are compatible with leading AI coding platforms like Bolt.new and Lovable, enabling seamless further development and customization.',
    icon: Code2,
  },
  {
    title: 'AI-Verified Originality',
    description: 'Every prototype undergoes rigorous AI analysis to ensure 100% original source code, free from copyright issues and legal concerns.',
    icon: Shield,
  },
  {
    title: 'Elite Developer Community',
    description: 'Exclusive community of globally verified developers, ensuring the highest quality standards in prototype development and customization.',
    icon: Users,
  },
];

export function QualityAssured() {
  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Quality Assured Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Production-Grade AI Prototypes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Every prototype in our marketplace meets strict quality standards and is verified for immediate market deployment.
          </p>
        </div>
        <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <feature.icon 
                    className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" 
                    aria-hidden="true" 
                  />
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}