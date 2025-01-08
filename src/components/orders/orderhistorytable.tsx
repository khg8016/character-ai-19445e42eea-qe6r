import { formatRelativeTime } from '../../utils/dateUtils';

interface Payment {
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  amount: number;
  credits: number;
  status: string;
  created_at: string;
  payments: Payment[];
}

interface OrderHistoryTableProps {
  orders: Order[];
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="py-3 px-4 text-gray-400 font-medium">주문일시</th>
            <th className="py-3 px-4 text-gray-400 font-medium">크레딧</th>
            <th className="py-3 px-4 text-gray-400 font-medium">결제금액</th>
            <th className="py-3 px-4 text-gray-400 font-medium">상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-700">
              <td className="py-3 px-4">
                <div className="text-white">
                  {formatRelativeTime(order.created_at)}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-white">
                  {order.credits.toLocaleString()} 크레딧
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-white">
                  ${(order.amount / 100).toLocaleString()}
                </div>
              </td>
              <td className="py-3 px-4">
                <OrderStatus status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
  const styles = {
    pending: 'bg-yellow-600/20 text-yellow-400',
    completed: 'bg-green-600/20 text-green-400',
    failed: 'bg-red-600/20 text-red-400',
    cancelled: 'bg-gray-600/20 text-gray-400'
  };

  const labels = {
    pending: '처리중',
    completed: '완료',
    failed: '실패',
    cancelled: '취소됨'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}