import { Character, CharacterStats } from '../types/database';
import { ThumbsUp, MessageCircle } from 'lucide-react';

interface CharacterProfileProps {
  character: Character;
  stats: CharacterStats;
}

export function CharacterProfile({ character, stats }: CharacterProfileProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <img
          src={character.avatar_url || 'https://via.placeholder.com/100'}
          alt={character.name}
          className="h-20 w-20 rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-xl font-bold text-gray-900">{character.name}</h2>
          <p className="text-sm text-gray-500">{character.description}</p>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-6">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            {stats.chat_count.toLocaleString()} 대화
          </span>
        </div>
        <div className="flex items-center">
          <ThumbsUp className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            {stats.like_count.toLocaleString()} 좋아요
          </span>
        </div>
      </div>
    </div>
  );
}