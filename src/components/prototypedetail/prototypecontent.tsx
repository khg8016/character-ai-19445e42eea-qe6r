import React from 'react';
import { FeatureList } from './FeatureList';
import { Requirements } from './Requirements';
import { GettingStarted } from './GettingStarted';
import type { Prototype } from '../../types/prototype';

interface PrototypeContentProps {
  prototype: Prototype;
}

export function PrototypeContent({ prototype }: PrototypeContentProps) {
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <FeatureList features={prototype.features} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <Requirements requirements={prototype.requirements} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <GettingStarted steps={prototype.gettingStarted} />
      </div>
    </div>
  );
}