import React from 'react';
import { Coins } from 'lucide-react';
import { useCreditBalance } from '../../hooks/useCreditBalance';

export function CreditBalance() {
  const { balance, loading } = useCreditBalance();

  if (loading) {
    return (
      <div className="animate-pulse flex items-center space-x-2">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
      <Coins className="w-5 h-5" />
      <span className="font-medium">{balance} credits</span>
    </div>
  );
}