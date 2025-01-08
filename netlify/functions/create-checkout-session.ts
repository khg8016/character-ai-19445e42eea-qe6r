import { Handler } from '@netlify/functions';
import { validateEnvVars } from './utils/env';
import { stripe } from './utils/stripe';
import { supabase } from './utils/supabase';
import { STRIPE } from '../../src/lib/stripe/constants';

validateEnvVars();

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { quantity, userId, successUrl, cancelUrl } = JSON.parse(event.body || '{}');

    if (!quantity || !userId || !successUrl || !cancelUrl) {
      throw new Error('Missing required parameters');
    }

    // Calculate total amount (1 credit = $1)
    const amount = quantity * 100; // Convert to cents
    const credits = quantity; // 1:1 ratio

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      client_reference_id: userId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{
        price: STRIPE.PRICES.CREDITS_1,
        quantity: quantity
      }],
      metadata: {
        credits: credits.toString()
      }
    });

    // Create order and payment record
    const { error } = await supabase.rpc('create_order_with_payment', {
      p_user_id: userId,
      p_amount: amount,
      p_credits: credits,
      p_stripe_session_id: session.id
    });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id })
    };
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};