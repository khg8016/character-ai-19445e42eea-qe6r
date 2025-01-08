import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserProfile } from '../types/user';
import { useProfile as useProfileHook } from '../hooks/useProfile';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  isLoading: true,
  error: null,
  refreshProfile: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { profile, isLoading, error, refreshProfile } = useProfileHook();

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);