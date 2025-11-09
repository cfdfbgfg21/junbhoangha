
import React, { useState } from 'react';
import useUserStore from '../store/userStore';
import type { User, Service, Payment, ServiceStatus, PaymentStatus } from '../types';
import { WalletIcon, ServicesIcon, HistoryIcon, LogoutIcon, UserCircleIcon, ChevronDownIcon } from './icons';
import TopUpModal from './TopUpModal';

const statusColors: { [key in ServiceStatus]: string } = {
  active: 'bg-green-500',
  expired: 'bg-red-500',
  cancelled: 'bg-gray-500',
};

const paymentStatusColors: { [key in PaymentStatus]: string } = {
  completed: 'text-green-400',
  pending: 'text-yellow-400',
  failed: 'text-red-400',
};

// --- Sub-components (defined outside main component for performance) ---

const Header: React.FC<{ user: User }> = ({ user }) => {
  const logout = useUserStore((state) => state.logout);
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-lg font-semibold text-slate-100">{user.name}</h1>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const BalanceCard: React.FC<{ balance: number; onTopUp: () => void }> = ({ balance, onTopUp }) => {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <WalletIcon className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-xl font-semibold text-slate-100">Account Balance</h2>
                </div>
                <p className="text-4xl font-bold text-white">${balance.toFixed(2)}</p>
                <p className="text-sm text-slate-400 mt-1">Available for services and renewals.</p>
            </div>
            <button onClick={onTopUp} className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md shadow-cyan-900/50">
                Top Up Balance
            </button>
        </div>
    );
};

const ServiceList: React.FC<{ services: Service[] }> = ({ services }) => {
    const renewService = useUserStore((state) => state.renewService);
    const balance = useUserStore((state) => state.user?.balance ?? 0);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
                <ServicesIcon className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-slate-100">Your Services</h2>
            </div>
            <div className="space-y-4">
                {services.map(service => (
                    <div key={service.id} className="bg-slate-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <p className="font-semibold text-white">{service.name}</p>
                            <p className="text-sm text-slate-400">Renews on: {service.renewalDate}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                            <div className="flex items-center space-x-2">
                                <span className={`w-3 h-3 rounded-full ${statusColors[service.status]}`}></span>
                                <span className="text-sm capitalize">{service.status}</span>
                            </div>
                            <p className="text-lg font-bold">${service.price.toFixed(2)}</p>
                            {service.status === 'expired' && (
                                <button
                                  onClick={() => renewService(service.id)}
                                  disabled={balance < service.price}
                                  className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                                >
                                    Renew
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PaymentHistory: React.FC<{ payments: Payment[] }> = ({ payments }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
    <div className="flex items-center space-x-3 mb-4">
      <HistoryIcon className="w-6 h-6 text-cyan-400" />
      <h2 className="text-xl font-semibold text-slate-100">Payment History</h2>
    </div>
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {payments.map(payment => (
        <div key={payment.id} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
          <div>
            <p className="font-medium text-white">Payment Received</p>
            <p className="text-xs text-slate-400">{new Date(payment.date).toDateString()}</p>
          </div>
          <p className={`font-bold text-lg ${paymentStatusColors[payment.status]}`}>+${payment.amount.toFixed(2)}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Dashboard Component ---

const DashboardScreen: React.FC = () => {
    const user = useUserStore((state) => state.user);
    const services = useUserStore((state) => state.services);
    const payments = useUserStore((state) => state.payments);
    const [isTopUpModalOpen, setTopUpModalOpen] = useState(false);

    if (!user) return null; // Should not happen if App component logic is correct

    return (
        <>
            <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
                <Header user={user} />
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="space-y-8">
                        <BalanceCard balance={user.balance} onTopUp={() => setTopUpModalOpen(true)} />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2">
                            <ServiceList services={services} />
                          </div>
                          <div>
                            <PaymentHistory payments={payments} />
                          </div>
                        </div>
                    </div>
                </main>
            </div>
            <TopUpModal isOpen={isTopUpModalOpen} onClose={() => setTopUpModalOpen(false)} />
        </>
    );
};

export default DashboardScreen;
