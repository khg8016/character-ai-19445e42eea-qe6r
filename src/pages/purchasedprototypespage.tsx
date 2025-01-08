import React from 'react';
import { Package } from 'lucide-react';
import { PurchasedPrototypes } from '../components/profile/PurchasedPrototypes';

export function PurchasedPrototypesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Prototypes
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <PurchasedPrototypes />
          </div>
        </div>
      </div>
    </div>
  );
}