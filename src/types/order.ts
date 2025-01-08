export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  amount: number;
  credits: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: PaymentStatus;
  transaction_id?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}