import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { 
  checkCreditBalance, 
  getCreditHistory, 
  getCreditStats 
} from '../lib/credits';
import type { CreditTransaction } from '../types/database';

interface CreditStats {
  totalChats: number;
  totalCreditsUsed: number;
}

export function useCredits() {
  const { supabase } = useSupabase();
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [stats, setStats] = useState<CreditStats>({
    totalChats: 0,
    totalCreditsUsed: 0
  });
  const [loading, setLoading] = useState(true);

  const loadCredits = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [balance, transactions, userStats] = await Promise.all([
        checkCreditBalance(supabase, user.id),
        getCreditHistory(supabase, user.id),
        getCreditStats(supabase, user.id)
      ]);

      setCredits(balance);
      setHistory(transactions);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load credits:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;

    loadCredits();

    const channel = supabase
      .channel('credits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits'
        },
        () => loadCredits()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'credit_transactions'
        },
        () => loadCredits()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, loadCredits]);

  return {
    credits,
    history,
    stats,
    loading,
    refresh: loadCredits
  };
}