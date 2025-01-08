import React, { useState } from 'react';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import { formatDate } from '../../utils/date';
import { Coins, ChevronDown, ChevronUp } from 'lucide-react';

export function SalesHistory() {
  const { prototypeSales, loading, totalRevenue } = useSalesHistory();
  const [expandedPrototype, setExpandedPrototype] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    );
  }

  if (prototypeSales.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          판매 내역이 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          첫 판매를 기다리고 있어요!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          판매 내역
        </h2>
        <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Coins className="w-5 h-5 text-emerald-500 mr-2" />
          총 {totalRevenue} credits
        </div>
      </div>
      
      <div className="space-y-4">
        {prototypeSales.map(prototype => (
          <div key={prototype.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setExpandedPrototype(
                expandedPrototype === prototype.id ? null : prototype.id
              )}
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
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      총 판매수: {prototype.totalSales}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      총 수익: {prototype.totalRevenue} credits
                    </span>
                  </div>
                </div>
              </div>
              
              {expandedPrototype === prototype.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {expandedPrototype === prototype.id && (
              <div className="border-t border-gray-200 dark:border-gray-600">
                {prototype.sales.map(sale => (
                  <div 
                    key={sale.id}
                    className="p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          구매자: {sale.buyer.name}
                        </span>
                        <br />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          구매일: {formatDate(sale.purchased_at)}
                        </span>
                      </div>
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <Coins className="w-4 h-4 mr-1" />
                        {sale.amount} credits
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}