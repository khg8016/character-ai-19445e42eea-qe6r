import React from 'react';
import { Zap, Rocket, Shield, Code2, Cpu, Workflow } from 'lucide-react';

const features = [
  {
    name: 'Lightning Fast',
    description: 'Get your project up and running in seconds with our pre-built templates.',
    icon: Zap,
  },
  {
    name: 'Production Ready',
    description: 'All prototypes are built with best practices and ready for production.',
    icon: Rocket,
  },
  {
    name: 'Secure by Default',
    description: 'Built-in security features and best practices to keep your data safe.',
    icon: Shield,
  },
  {
    name: 'Modern Stack',
    description: 'Built with the latest technologies and frameworks.',
    icon: Code2,
  },
  {
    name: 'AI Powered',
    description: 'Leverage the power of AI to build better applications faster.',
    icon: Cpu,
  },
  {
    name: 'Customizable',
    description: 'Easily customize and extend the prototypes to fit your needs.',
    icon: Workflow,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Build Faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to build your next project
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Sprint provides everything you need to get your project off the ground quickly and efficiently.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  {feature.name}
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