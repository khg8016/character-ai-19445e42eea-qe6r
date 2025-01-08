// Add these interfaces to the existing types
export interface UserCredits {
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'charge' | 'use';
  description: string;
  created_at: string;
}