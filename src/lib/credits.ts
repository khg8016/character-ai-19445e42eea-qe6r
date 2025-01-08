import { SupabaseClient } from '@supabase/supabase-js';

export async function checkCreditBalance(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data } = await supabase
    .from('user_credits')
    .select('balance')
    .eq('user_id', userId)
    .single();
    
  return data?.balance || 0;
}

export async function useCreditsForMessage(
  supabase: SupabaseClient,
  userId: string,
  amount: number = 1
): Promise<boolean> {
  const { data: success } = await supabase.rpc('use_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_description: '메시지 전송'
  });

  return !!success;
}

export async function getCreditHistory(
  supabase: SupabaseClient,
  userId: string
) {
  const { data } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getCreditStats(
  supabase: SupabaseClient,
  userId: string
) {
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId);

  if (!transactions) return {
    totalChats: 0,
    totalCreditsUsed: 0
  };

  return {
    totalChats: transactions.filter(tx => 
      tx.type === 'use' && tx.description.includes('메시지')
    ).length,
    totalCreditsUsed: transactions
      .filter(tx => tx.type === 'use')
      .reduce((sum, tx) => sum + tx.amount, 0)
  };
}