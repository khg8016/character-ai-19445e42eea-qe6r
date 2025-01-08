export type UserLevel = 'Admin' | 'Expert' | 'Rookie';

export interface UserProfile {
  id: string;
  email: string;
  display_id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  github_url?: string;
  youtube_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  github_token?: string;
  user_level: UserLevel;
  created_at: string;
}

export interface ProfileFormData {
  display_id: string;
  full_name: string;
  bio: string;
  website: string;
  github_url?: string;
  youtube_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  github_token?: string;
}