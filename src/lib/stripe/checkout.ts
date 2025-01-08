import { stripePromise } from './stripe';

interface CheckoutOptions {
  quantity: number;
  successUrl: string;
  cancelUrl: string;
  clientReferenceId: string;
}

export async function redirectToCheckout({
  quantity,
  successUrl,
  cancelUrl,
  clientReferenceId
}: CheckoutOptions) {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Failed to load Stripe');

    // Create checkout session
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity,
        userId: clientReferenceId,
        successUrl,
        cancelUrl
      })
    });

    const { sessionId, error } = await response.json();
    if (error) throw new Error(error);
    if (!sessionId) throw new Error('No session ID returned');

    // Redirect to checkout
    const { error: redirectError } = await stripe.redirectToCheckout({
      sessionId
    });

    if (redirectError) throw redirectError;
  } catch (err) {
    console.error('Checkout error:', err);
    throw err;
  }
}