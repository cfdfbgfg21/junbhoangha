
export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export type ServiceStatus = 'active' | 'expired' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  price: number;
  renewalDate: string;
  status: ServiceStatus;
}

export type PaymentStatus = 'completed' | 'pending' | 'failed';

export interface Payment {
  id: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}
