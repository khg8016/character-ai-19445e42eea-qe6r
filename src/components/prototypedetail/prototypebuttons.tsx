import React from 'react';
import { Play } from 'lucide-react';
import { usePrototypePurchase } from '../../hooks/usePrototypePurchase';
import { useAuth } from '../auth/AuthContext';
import type { Prototype } from '../../types/prototype';

interface PrototypeButtonsProps {
  prototype: Prototype;
  onPreviewClick: () => void;
  onPurchaseSuccess?: () => void;
}

export function PrototypeButtons({ prototype, onPreviewClick, onPurchaseSuccess }: PrototypeButtonsProps) {
  const { user } = useAuth();
  const { purchasePrototype, loading, hasAccess } = usePrototypePurchase(prototype.id);

  const handlePurchase = async () => {
    const success = await purchasePrototype(prototype.creditPrice);
    if (success) {
      onPurchaseSuccess?.();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {prototype.preview_url && (
        <button 
          onClick={onPreviewClick}
          className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg 
                   hover:bg-emerald-700 transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          Live Preview
        </button>
      )}

      {!hasAccess && (
        <button
          onClick={handlePurchase}
          disabled={loading || !user}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Buy (${prototype.creditPrice} credits)`}
        </button>
      )}
    </div>
  );
}