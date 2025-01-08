import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { validateEnvVars, requiredEnvVars } from './utils/env';
import { stripe } from './utils/stripe';
import { supabase } from './utils/supabase';

validateEnvVars();

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const stripeSignature = event.headers['stripe-signature'];

  try {
    if (!stripeSignature) {
      throw new Error('Missing Stripe signature');
    }

    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      stripeSignature,
      requiredEnvVars.STRIPE_WEBHOOK_SECRET
    );

    console.log('Received webhook event:', stripeEvent.type);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log('Session data:', session);
      
      if (session.payment_status === 'paid') {
        const userId = session.client_reference_id;
        if (!userId) {
          throw new Error('Invalid session data: missing user ID');
        }

        // Complete the payment and order
        await supabase.rpc('complete_payment', {
          p_stripe_session_id: session.id,
          p_stripe_payment_intent_id: session.payment_intent as string
        });

        console.log(`Payment completed for session ${session.id}`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error: any) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: error.message || 'Webhook processing failed' 
      })
    };
  }
};