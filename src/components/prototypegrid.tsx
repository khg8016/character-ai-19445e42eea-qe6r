import React from 'react';
import { PrototypeCard } from './PrototypeCard';
import { Loader } from 'lucide-react';
import type { Prototype } from '../types/prototype';

interface PrototypeGridProps {
  prototypes: Prototype[];
  loading: boolean;
  error: Error | null;
  onPrototypeSelect: (id: string) => void;
}

export function PrototypeGrid({ prototypes, loading, error, onPrototypeSelect }: PrototypeGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Failed to load prototypes</p>
      </div>
    );
  }

  if (prototypes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No prototypes found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prototypes.map((prototype) => (
        <PrototypeCard
          key={prototype.id}
          prototype={prototype}
          onClick={() => onPrototypeSelect(prototype.id)}
        />
      ))}
    </div>
  );
}