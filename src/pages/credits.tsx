import React, { useState } from 'react';
import { CreditCard, Zap, Shield, Clock, Minus, Plus } from 'lucide-react';
import { CreditBalance } from '../components/credits/CreditBalance';
import { TransactionHistory } from '../components/credits/TransactionHistory';
import { useStripeCheckout } from '../hooks/useStripeCheckout';
import toast from 'react-hot-toast';

export function Credits() {
  const [credits, setCredits] = useState(10);
  const { createCheckoutSession, loading } = useStripeCheckout();
  
  const totalPrice = credits; // 1 credit = $1

  const handleIncrement = () => {
    setCredits(prev => prev + 1);
  };

  const handleDecrement = () => {
    setCredits(prev => Math.max(1, prev - 1));
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setCredits(value);
    }
  };

  const handlePurchase = async () => {
    try {
      await createCheckoutSession(credits); // Each credit is $1
    } catch (error) {
      toast.error('Failed to start checkout process');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Credits
          </h1>
          <div className="mt-4">
            <CreditBalance />
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Purchase Credits
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                1 credit = $1
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Zap className="w-5 h-5 mr-2" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Shield className="w-5 h-5 mr-2" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5 mr-2" />
                <span>Never expires</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <button
                onClick={handleDecrement}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="w-40">
                <input
                  type="number"
                  value={credits}
                  onChange={handleCustomChange}
                  min="1"
                  step="1"
                  className="w-full text-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xl font-semibold"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                  credits
                </p>
              </div>

              <button
                onClick={handleIncrement}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totalPrice}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total price
              </p>
            </div>

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 rounded-md 
                       bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {loading ? 'Processing...' : 'Purchase Credits'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
}