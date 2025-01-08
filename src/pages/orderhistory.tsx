import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layouts/MainLayout';
import { OrderHistoryTable } from '../components/orders/OrderHistoryTable';
import { Receipt } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { getOrderHistory } from '../lib/orders';

interface Order {
  id: string;
  amount: number;
  credits: number;
  status: string;
  created_at: string;
  payments: Array<{
    stripe_session_id: string;
    stripe_payment_intent_id: string | null;
    status: string;
    created_at: string;
  }>;
}

export function OrderHistory() {
  const { supabase } = useSupabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data: { user } } = await supabase?.auth.getUser() || {};
        if (!user) throw new Error('User not found');

        const orderHistory = await getOrderHistory(user.id);
        setOrders(orderHistory);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError('주문 내역을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [supabase]);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#25262b] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">주문 내역</h1>
              <p className="text-sm text-gray-400">
                크레딧 구매 내역을 확인하세요
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">주문 내역을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">주문 내역이 없습니다</p>
            </div>
          ) : (
            <OrderHistoryTable orders={orders} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}