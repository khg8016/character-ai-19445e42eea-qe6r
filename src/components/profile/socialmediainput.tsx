import React from 'react';
import { Github, Youtube, Twitter, Linkedin } from 'lucide-react';

interface SocialMediaInputProps {
  type: 'github' | 'youtube' | 'twitter' | 'linkedin';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const ICONS = {
  github: Github,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
};

const PATTERNS = {
  github: '^https?:\\/\\/(www\\.)?github\\.com\\/[A-Za-z0-9_-]+\\/?$',
  youtube: '^https?:\\/\\/(www\\.)?(youtube\\.com\\/(c\\/|channel\\/|user\\/)?|youtu\\.be\\/)[A-Za-z0-9_-]+\\/?',
  twitter: '^https?:\\/\\/(www\\.)?(twitter\\.com|x\\.com)\\/[A-Za-z0-9_]+\\/?$',
  linkedin: '^https?:\\/\\/(www\\.)?linkedin\\.com\\/(in|company)\\/[A-Za-z0-9_-]+\\/?$',
};

export function SocialMediaInput({ type, value, onChange, placeholder }: SocialMediaInputProps) {
  const Icon = ICONS[type];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pattern={PATTERNS[type]}
          placeholder={placeholder}
          className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}