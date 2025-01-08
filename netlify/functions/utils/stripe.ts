import Stripe from 'stripe';
import { requiredEnvVars } from './env';

export const stripe = new Stripe(requiredEnvVars.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
});