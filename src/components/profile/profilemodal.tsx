import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { supabase } from '../../lib/supabase';
import { AvatarUpload } from './AvatarUpload';
import type { ProfileFormData } from '../../types/user';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    display_id: '',
    full_name: '',
    bio: '',
    website: '',
  });
  const [displayIdAvailable, setDisplayIdAvailable] = useState(true);
  const [checkingDisplayId, setCheckingDisplayId] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_id: profile.display_id || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  async function checkDisplayIdAvailability(display_id: string) {
    if (!display_id) {
      setDisplayIdAvailable(false);
      return;
    }

    setCheckingDisplayId(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('display_id', display_id)
        .neq('id', user?.id || '')
        .maybeSingle();

      if (error) throw error;
      setDisplayIdAvailable(!data);
    } catch (error) {
      console.error('Error checking display ID:', error);
    } finally {
      setCheckingDisplayId(false);
    }
  }

  const handleDisplayIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setFormData({ ...formData, display_id: value });
    checkDisplayIdAvailability(value);
  };

  const handleAvatarUpload = async (url: string) => {
    await refreshProfile();
  };

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !displayIdAvailable) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      await refreshProfile();
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile Settings</h2>

        <form onSubmit={updateProfile} className="space-y-4">
          <AvatarUpload
            currentAvatarUrl={profile?.avatar_url}
            onUploadSuccess={handleAvatarUpload}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Display ID
            </label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
                @
              </span>
              <input
                type="text"
                value={formData.display_id}
                onChange={handleDisplayIdChange}
                pattern="[a-z0-9_]+"
                maxLength={15}
                className={`pl-7 block w-full rounded-md border shadow-sm 
                  ${displayIdAvailable 
                    ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500' 
                    : 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                  }
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {checkingDisplayId ? (
                <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Checking availability...
                </span>
              ) : !displayIdAvailable && formData.display_id && (
                <span className="mt-1 text-sm text-red-500 dark:text-red-400">
                  This display ID is not available
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Only lowercase letters, numbers, and underscores allowed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !displayIdAvailable}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     disabled:opacity-50 dark:focus:ring-offset-gray-800"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}