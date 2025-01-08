import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface CreditPackageProps {
  credits: number;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function CreditPackage({ credits, price, quantity, onQuantityChange }: CreditPackageProps) {
  const handleIncrement = () => onQuantityChange(quantity + 1);
  const handleDecrement = () => onQuantityChange(Math.max(1, quantity - 1));

  return (
    <div className="bg-[#2c2d32] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">구매할 크레딧</span>
        <span className="text-xl font-bold text-white">
          {(credits * quantity).toLocaleString()}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">수량</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="p-1 rounded-md bg-[#35363c] text-gray-400 hover:text-white 
              disabled:opacity-50 disabled:hover:text-gray-400"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-white font-medium w-8 text-center">{quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-1 rounded-md bg-[#35363c] text-gray-400 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">결제 금액</span>
        <span className="text-white font-medium">
          ${(price * quantity).toLocaleString()}
        </span>
      </div>
    </div>
  );
}