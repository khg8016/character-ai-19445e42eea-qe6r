import { Message } from '../types/database';
import { ThumbsUp, Copy } from 'lucide-react';
import { useState } from 'react';
import { ProfileImage } from './common/ProfileImage';

interface MessageBubbleProps {
  message: Message;
  character?: {
    name: string;
    avatar_url: string | null;
  } | null;
}

export function MessageBubble({ message, character }: MessageBubbleProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="flex w-full max-w-full px-4">
      <div className={`flex ${message.is_from_character ? 'justify-start' : 'justify-end'} w-full max-w-full group animate-fade-in`}>
        {message.is_from_character && character && (
          <div className="flex-shrink-0 mr-3">
            <div className="relative">
              <div className="w-8 h-8 bg-[#2c2d32] rounded-full ring-2 ring-gray-800 flex items-center justify-center overflow-hidden">
                <ProfileImage
                  src={character.avatar_url}
                  alt={character.name}
                  size="sm"
                  objectFit="contain"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1b1e]" />
            </div>
          </div>
        )}
        
        <div className="flex flex-col max-w-[calc(100%-4rem)] min-w-0">
          {message.is_from_character && character && (
            <span className="text-sm text-blue-400 mb-1 ml-1 font-medium truncate">
              {character.name}
            </span>
          )}
          <div className="relative group/bubble">
            <div className={`
              relative rounded-2xl px-4 py-3
              ${message.is_from_character 
                ? 'bg-[#25262b] text-gray-100 border border-gray-800' 
                : 'bg-blue-600 text-white'}
            `}>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed break-words">
                {message.content}
              </p>

              {message.is_from_character && (
                <>
                  {/* 모바일 화면에서만 보이는 하단 액션 버튼 */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50 sm:hidden">
                    <div className="text-xs text-gray-400">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-full bg-[#2c2d32] hover:bg-[#35363c] transition-colors"
                        title={isCopied ? '복사됨' : '메시지 복사'}
                      >
                        <Copy className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={handleLike}
                        className={`p-1.5 rounded-full bg-[#2c2d32] hover:bg-[#35363c] transition-colors
                          ${isLiked ? 'text-blue-400' : 'text-gray-400'}`}
                        title={isLiked ? '좋아요 취소' : '좋아요'}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* PC 화면에서만 보이는 우측 액션 버튼 */}
                  <div className="hidden sm:flex sm:absolute sm:-right-24 sm:top-0 sm:opacity-0 sm:group-hover/bubble:opacity-100 sm:transition-opacity sm:items-center sm:gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-full bg-[#2c2d32] hover:bg-[#35363c] transition-colors"
                      title={isCopied ? '복사됨' : '메시지 복사'}
                    >
                      <Copy className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={handleLike}
                      className={`p-2 rounded-full bg-[#2c2d32] hover:bg-[#35363c] transition-colors
                        ${isLiked ? 'text-blue-400' : 'text-gray-400'}`}
                      title={isLiked ? '좋아요 취소' : '좋아요'}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                  </div>

                  {/* PC 화면에서 시간 표시 */}
                  <div className="hidden sm:block mt-1 text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </>
              )}

              {!message.is_from_character && (
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className={`
              absolute bottom-[12px] w-4 h-4 rotate-45
              ${message.is_from_character
                ? '-left-2 bg-[#25262b] border-l border-b border-gray-800'
                : '-right-2 bg-blue-600'}
            `} />
          </div>
        </div>
      </div>
    </div>
  );
}