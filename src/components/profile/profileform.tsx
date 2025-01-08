import React, { useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { supabase } from '../../lib/supabase';
import { SocialMediaInput } from './SocialMediaInput';
import { GitHubTokenInput } from './GitHubTokenInput';
import { AvatarUpload } from './AvatarUpload';
import { validateGitHubToken } from '../../utils/github';
import type { UserProfile, ProfileFormData } from '../../types/user';
import { UserLevelBadge } from './UserLevelBadge';
import toast from 'react-hot-toast';

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { refreshProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    display_id: profile.display_id || '',
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    website: profile.website || '',
    github_url: profile.github_url || '',
    youtube_url: profile.youtube_url || '',
    twitter_url: profile.twitter_url || '',
    linkedin_url: profile.linkedin_url || '',
    github_token: profile.github_token || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate GitHub token if provided
      if (formData.github_token) {
        const isValid = await validateGitHubToken(formData.github_token);
        if (!isValid) {
          toast.error('Invalid GitHub token. Please provide a valid token or remove it.');
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_id: formData.display_id,
          full_name: formData.full_name,
          bio: formData.bio,
          website: formData.website,
          github_url: formData.github_url || null,
          youtube_url: formData.youtube_url || null,
          twitter_url: formData.twitter_url || null,
          linkedin_url: formData.linkedin_url || null,
          github_token: formData.github_token || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar and User Level */}
      <div className="flex flex-col items-center space-y-4 pb-8 border-b border-gray-200 dark:border-gray-700">
        <AvatarUpload
          currentAvatarUrl={profile.avatar_url}
          onUploadSuccess={() => refreshProfile()}
        />
        <UserLevelBadge level={profile.user_level} />
      </div>

      {/* Basic Information */}
      <div className="space-y-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Display ID
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
                @
              </span>
              <input
                type="text"
                value={formData.display_id}
                onChange={(e) => setFormData({ ...formData, display_id: e.target.value })}
                pattern="[a-z0-9_]+"
                maxLength={15}
                className="pl-8 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Only lowercase letters, numbers, and underscores allowed
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5"
          />
        </div>
      </div>

      {/* GitHub Token */}
      <div className="space-y-6 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Development Settings
        </h3>
        
        <GitHubTokenInput
          value={formData.github_token || ''}
          onChange={(value) => setFormData({ ...formData, github_token: value })}
        />
      </div>

      {/* Social Media Links */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Social Media Profiles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SocialMediaInput
            type="github"
            value={formData.github_url}
            onChange={(value) => setFormData({ ...formData, github_url: value })}
            placeholder="https://github.com/username"
          />

          <SocialMediaInput
            type="youtube"
            value={formData.youtube_url}
            onChange={(value) => setFormData({ ...formData, youtube_url: value })}
            placeholder="https://youtube.com/c/channelname"
          />

          <SocialMediaInput
            type="twitter"
            value={formData.twitter_url}
            onChange={(value) => setFormData({ ...formData, twitter_url: value })}
            placeholder="https://twitter.com/username"
          />

          <SocialMediaInput
            type="linkedin"
            value={formData.linkedin_url}
            onChange={(value) => setFormData({ ...formData, linkedin_url: value })}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 
                   hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   dark:focus:ring-offset-gray-800 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}