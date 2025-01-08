import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSend: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  message,
  onMessageChange,
  onSend,
  isLoading
}: ChatInputProps) {
  return (
    <div className="relative max-w-4xl mx-auto">
      <form onSubmit={onSend} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="w-full px-4 py-3 bg-[#2c2d32] text-white rounded-lg pr-24
            border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder-gray-500"
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md
              text-white bg-blue-600 hover:bg-blue-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 mt-2 text-center">
        이 캐릭터는 AI이며 실제 사람이 아닙니다. AI가 말하는 모든 것은 허구로 생각하세요.
      </p>
    </div>
  );
}