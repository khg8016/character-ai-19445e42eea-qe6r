import React from 'react';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import { formatDate } from '../../utils/date';

export function TransactionHistory() {
  const { transactions, loading } = useTransactionHistory();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Transaction History
      </h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="py-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {transaction.type === 'purchase' ? 'Credit Purchase' : 'Credit Used'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {transaction.description}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'purchase' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'purchase' ? '+' : '-'}{Math.abs(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}