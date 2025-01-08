export interface CheckoutOptions {
  quantity: number;
  successUrl: string;
  cancelUrl: string;
  clientReferenceId?: string;
}