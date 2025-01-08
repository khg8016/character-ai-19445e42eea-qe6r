import { supabase } from './supabase';

export async function createOrderWithPayment(
  userId: string,
  amount: number,
  credits: number
): Promise<{ sessionId: string }> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .rpc('create_order_with_payment', {
      p_user_id: userId,
      p_amount: amount,
      p_credits: credits,
      p_stripe_session_id: null // Will be updated by the webhook
    });

  if (error) throw error;
  return { sessionId: data };
}

export async function getOrderHistory(userId: string) {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      payments (
        stripe_session_id,
        stripe_payment_intent_id,
        status,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}