export interface Order {
  order_no: string;
  created_at: string;
  user_email: string;
  amount: number;
  plan: string;
  expired_at: string;
  order_status: number; // 1: pending, 2: paid, 3: cancelled
  credits: number;
  currency: string;
  stripe_session_id?: string;
  paied_at?: string;
}

export interface CreateOrderParams {
  user_email: string;
  plan: string;
  isYearly: boolean;
}

export interface PlanDetails {
  name: string;
  price: number;
  credits: number;
  duration: number; // in months
  currency: string;
}

export interface OrderResponse {
  url?: string;
  error?: string;
  code?: number;
  message?: string;
}

export interface CheckoutRequest {
  credits: number;
  currency: string;
  amount: number;
  plan: 'monthly' | 'one-time';
}
