import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePurchasedPrototypes } from '../../hooks/usePurchasedPrototypes';

export function PurchasedPrototypes() {
  const navigate = useNavigate();
  const { prototypes, loading } = usePurchasedPrototypes();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    );
  }

  if (prototypes.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          구매한 프로토타입이 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          프로토타입을 구매하고 소스코드를 다운로드하세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        구매한 프로토타입
      </h2>
      
      <div className="space-y-4">
        {prototypes.map(prototype => (
          <div 
            key={prototype.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <img
                src={prototype.image}
                alt={prototype.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {prototype.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  구매일: {new Date(prototype.purchased_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/prototypes/${prototype.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors text-sm font-medium"
            >
              상세보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}