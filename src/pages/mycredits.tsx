import { MainLayout } from '../components/layouts/MainLayout';
import { Coins, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCredits } from '../hooks/useCredits';
import { CreditHistory } from '../components/credits/CreditHistory';
import { CreditStats } from '../components/credits/CreditStats';

export function MyCredits() {
  const { credits, loading } = useCredits();

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#25262b] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">내 크레딧</h1>
                <p className="text-gray-400 text-sm">
                  크레딧을 사용하여 AI 캐릭터와 대화하세요
                </p>
              </div>
            </div>
            <Link
              to="/credits"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                text-white text-sm font-medium rounded-lg transition-colors"
            >
              크레딧 구매
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">크레딧 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div className="bg-[#2c2d32] rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">현재 보유 크레딧</p>
              <p className="text-3xl font-bold text-white mb-1">
                {credits.toLocaleString()} <span className="text-lg">크레딧</span>
              </p>
              <p className="text-sm text-gray-400">
                메시지 1개당 1크레딧이 차감됩니다
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CreditStats />
          <CreditHistory />
        </div>
      </div>
    </MainLayout>
  );
}