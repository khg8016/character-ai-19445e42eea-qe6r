import { useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { redirectToCheckout } from '../lib/stripe/checkout';

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createCheckoutSession = async (quantity: number) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      setLoading(true);
      await redirectToCheckout({
        quantity,
        successUrl: `${window.location.origin}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/credits`,
        clientReferenceId: user.id
      });
    } catch (err) {
      console.error('Purchase error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading
  };
}