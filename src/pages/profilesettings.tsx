import React from 'react';
import { ProfileForm } from '../components/profile/ProfileForm';
import { useProfile } from '../contexts/ProfileContext';
import { Settings } from 'lucide-react';

export function ProfileSettings() {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
              <div className="space-y-6">
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h1>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <ProfileForm profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}