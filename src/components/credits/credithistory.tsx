import { useCredits } from '../../hooks/useCredits';
import { formatRelativeTime } from '../../utils/dateUtils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function CreditHistory() {
  const { history, loading } = useCredits();

  if (loading) {
    return (
      <div className="bg-[#25262b] rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">크레딧 사용 내역</h2>
        <div className="text-center py-4">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#25262b] rounded-xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">크레딧 사용 내역</h2>
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-[#2c2d32] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  item.type === 'charge' 
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {item.type === 'charge' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {item.type === 'charge' ? '크레딧 충전' : '크레딧 사용'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatRelativeTime(item.created_at)}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-medium ${
                item.type === 'charge'
                  ? 'text-blue-400'
                  : 'text-yellow-400'
              }`}>
                {item.type === 'charge' ? '+' : '-'}{item.amount} 크레딧
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">사용 내역이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}