import { useState } from 'react';
import { Character } from '../../types/database';
import { Brain, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ProfileImage } from '../common/ProfileImage';

interface CharacterProfileProps {
  character: Character;
  stats?: {
    chat_count: number;
    like_count: number;
  } | null;
}

export function CharacterProfile({ character, stats }: CharacterProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#25262b] rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-[#2c2d32] rounded-xl ring-2 ring-gray-800 flex items-center justify-center overflow-hidden">
          <ProfileImage
            src={character.avatar_url}
            alt={character.name}
            size="xl"
            objectFit="contain"
            className="w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white mb-1 truncate">
            {character.name}
          </h2>
          <div className="relative">
            <div className={`relative ${!isExpanded ? 'max-h-[4.5rem] overflow-hidden' : ''}`}>
              <p className="text-gray-400 text-sm mb-4 break-words whitespace-pre-wrap max-w-[640px]">
                {character.description}
              </p>
              {!isExpanded && character.description.length > 150 && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#25262b] to-transparent" />
              )}
            </div>
            {character.description.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 mt-1"
              >
                {isExpanded ? (
                  <>
                    접기
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    더보기
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center text-gray-400">
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="text-sm">{stats?.chat_count || 0} 대화</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Brain className="h-4 w-4 mr-1.5" />
              <span className="text-sm">AI 캐릭터</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}