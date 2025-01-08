import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export { stripePromise };