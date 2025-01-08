import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';

export function useCreditBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchBalance() {
      try {
        const { data, error } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setBalance(data.balance);
      } catch (error) {
        console.error('Error fetching credit balance:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [user]);

  return { balance, loading };
}