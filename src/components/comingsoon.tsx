import React from 'react';
import { RocketIcon } from 'lucide-react';

export function ComingSoon() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <RocketIcon className="h-8 w-8 text-emerald-500" />
            <h3 className="ml-2 text-2xl font-bold text-gray-900">Coming Soon</h3>
          </div>
          <p className="mt-4 text-gray-600">
            The marketplace is being populated with exciting AI MVP solutions.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center rounded-md bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200">
              Get notified when we launch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}