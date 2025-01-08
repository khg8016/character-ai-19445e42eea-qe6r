import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Character } from '../../types/database';
import { ProfileImage } from '../common/ProfileImage';

interface CharacterCardProps {
  character: Character & {
    character_stats?: {
      chat_count: number;
      like_count: number;
    } | null;
  };
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      to={`/chat/${character.id}`}
      className="block bg-[#25262b] rounded-xl overflow-hidden hover:bg-[#2c2d32] transition-all duration-200"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <ProfileImage
              src={character.avatar_url}
              alt={character.name}
              size="md"
              className="rounded-full ring-2 ring-gray-800"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-medium text-white truncate">
              {character.name}
            </h3>
            <div className="flex items-center text-sm text-gray-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{character.character_stats?.chat_count || 0}</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-400 line-clamp-2">
          {character.description}
        </p>
      </div>
    </Link>
  );
}