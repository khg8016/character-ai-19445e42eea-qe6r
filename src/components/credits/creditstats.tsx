import { useCredits } from '../../hooks/useCredits';
import { MessageSquare, Coins } from 'lucide-react';

export function CreditStats() {
  const { stats, loading } = useCredits();

  if (loading) {
    return (
      <div className="bg-[#25262b] rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">통계</h2>
        <div className="text-center py-4">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#25262b] rounded-xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">통계</h2>
      <div className="grid gap-4">
        <div className="bg-[#2c2d32] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <p className="text-sm text-gray-400">총 대화 수</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.totalChats.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-[#2c2d32] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-600/20 text-yellow-400">
              <Coins className="h-4 w-4" />
            </div>
            <p className="text-sm text-gray-400">총 사용 크레딧</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.totalCreditsUsed.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}