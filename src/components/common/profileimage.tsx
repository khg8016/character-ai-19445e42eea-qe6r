import { Brain } from 'lucide-react';

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  objectFit?: 'cover' | 'contain';
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32'
};

export function ProfileImage({ 
  src,
  alt,
  size = 'md',
  className = '',
  objectFit = 'cover'
}: ProfileImageProps) {
  if (!src) {
    return (
      <div className={`${sizes[size]} rounded-full bg-blue-600/20 flex items-center justify-center ${className}`}>
        <Brain className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-8 w-8'} text-blue-400`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || '프로필 이미지'}
      className={`${sizes[size]} ${className}`}
      style={{ objectFit }}
    />
  );
}