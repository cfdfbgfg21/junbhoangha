
import { create } from 'zustand';
import type { User, Service, Payment } from '../types';

interface UserState {
  user: User | null;
  services: Service[];
  payments: Payment[];
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  topUp: (amount: number) => void;
  renewService: (serviceId: string) => void;
}

// --- Mock Data ---
const mockUser: User = {
  id: 'usr_123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  balance: 125.50,
};

const mockServices: Service[] = [
  { id: 'srv_a', name: 'Pro Plan', price: 49.99, renewalDate: '2024-08-15', status: 'active' },
  { id: 'srv_b', name: 'VPN Service', price: 9.99, renewalDate: '2024-07-30', status: 'active' },
  { id: 'srv_c', name: 'Cloud Storage (1TB)', price: 15.00, renewalDate: '2024-06-25', status: 'expired' },
];

const mockPayments: Payment[] = [
    { id: 'pay_1', amount: 50.00, date: '2024-07-01', status: 'completed' },
    { id: 'pay_2', amount: 49.99, date: '2024-06-15', status: 'completed' },
    { id: 'pay_3', amount: 9.99, date: '2024-06-15', status: 'completed' },
];

// --- Zustand Store ---
const useUserStore = create<UserState>((set) => ({
  user: null,
  services: [],
  payments: [],
  isAuthenticated: false,
  login: (email) => set({ 
    user: { ...mockUser, email }, 
    services: mockServices,
    payments: mockPayments,
    isAuthenticated: true 
  }),
  logout: () => set({ user: null, services: [], payments: [], isAuthenticated: false }),
  topUp: (amount) => set((state) => ({
    user: state.user ? { ...state.user, balance: state.user.balance + amount } : null,
    payments: state.user ? [{ id: `pay_${Date.now()}`, amount, date: new Date().toISOString().split('T')[0], status: 'completed' }, ...state.payments] : state.payments,
  })),
  renewService: (serviceId) => set((state) => {
    const service = state.services.find(s => s.id === serviceId);
    if (!service || !state.user || state.user.balance < service.price) {
      // Not enough balance or service not found
      return state;
    }
    
    const newRenewalDate = new Date();
    newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);

    return {
      user: { ...state.user, balance: state.user.balance - service.price },
      services: state.services.map(s => 
        s.id === serviceId 
        ? { ...s, status: 'active', renewalDate: newRenewalDate.toISOString().split('T')[0] } 
        : s
      ),
      payments: [{id: `pay_${Date.now()}`, amount: service.price, date: new Date().toISOString().split('T')[0], status: 'completed'}, ...state.payments]
    };
  }),
}));

export default useUserStore;
