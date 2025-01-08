import React from 'react';
import type { UserLevel } from '../../types/user';

const LEVEL_STYLES: Record<UserLevel, { bg: string; text: string }> = {
  Admin: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-300' },
  Expert: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300' },
  Rookie: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300' },
};

interface UserLevelBadgeProps {
  level: UserLevel;
}

export function UserLevelBadge({ level }: UserLevelBadgeProps) {
  const styles = LEVEL_STYLES[level];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
      {level}
    </span>
  );
}