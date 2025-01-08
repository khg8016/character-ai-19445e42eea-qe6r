import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';
import toast from 'react-hot-toast';

export function usePrototypePurchase(prototypeId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const checkAccess = useCallback(async () => {
    if (!user || !prototypeId) return;

    try {
      const { data, error } = await supabase
        .from('purchased_prototypes')
        .select('id')
        .eq('user_id', user.id)
        .eq('prototype_id', prototypeId)
        .maybeSingle();

      if (!error && data) {
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Error checking access:', error);
    }
  }, [user, prototypeId]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const purchasePrototype = async (creditPrice: number) => {
    if (!user) {
      toast.error('Please sign in to purchase prototypes');
      return false;
    }

    setLoading(true);
    try {
      const { error: purchaseError } = await supabase.rpc('purchase_prototype', {
        p_prototype_id: prototypeId,
        p_user_id: user.id,
        p_credits: creditPrice
      });

      if (purchaseError) throw purchaseError;

      setHasAccess(true);
      toast.success('Prototype purchased successfully!');
      return true;
    } catch (error: any) {
      console.error('Purchase error:', error);
      if (error.message.includes('Insufficient credits')) {
        toast.error('Insufficient credits. Please purchase more credits.');
      } else if (error.message.includes('already purchased')) {
        toast.error('You already own this prototype.');
      } else {
        toast.error('Failed to purchase prototype');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    purchasePrototype,
    loading,
    hasAccess,
    refreshAccess: checkAccess
  };
}