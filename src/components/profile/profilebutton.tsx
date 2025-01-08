import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { UserLevelBadge } from './UserLevelBadge';

interface ProfileButtonProps {
  onClick: () => void;
}

export function ProfileButton({ onClick }: ProfileButtonProps) {
  const { profile, isLoading } = useProfile();
  
  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {profile?.full_name?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
        {profile?.display_id && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">@{profile.display_id}</span>
            <UserLevelBadge level={profile.user_level} />
          </div>
        )}
      </div>
    </button>
  );
}