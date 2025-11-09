
import React, { useState } from 'react';
import useUserStore from '../store/userStore';
import { QRCodeIcon, CloseIcon } from './icons';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetAmounts = [20, 50, 100, 250];

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState<number | string>(50);
    const [isConfirming, setIsConfirming] = useState(false);
    const topUp = useUserStore((state) => state.topUp);

    const handleConfirm = () => {
        const numericAmount = Number(amount);
        if(numericAmount > 0) {
            setIsConfirming(true);
            setTimeout(() => {
                topUp(numericAmount);
                setIsConfirming(false);
                onClose();
            }, 1500); // Simulate payment processing
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-8 relative transform transition-all animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white text-center mb-2">Top Up Your Balance</h2>
                <p className="text-slate-400 text-center mb-6">Scan the QR or use the form below.</p>
                
                <div className="bg-white p-4 rounded-lg flex justify-center items-center mb-6">
                    <QRCodeIcon className="w-32 h-32 text-slate-800" />
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {presetAmounts.map(pAmount => (
                            <button key={pAmount} onClick={() => setAmount(pAmount)} className={`py-2 rounded-lg text-sm font-semibold transition-colors ${amount === pAmount ? 'bg-cyan-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                ${pAmount}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Custom amount"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={isConfirming || Number(amount) <= 0}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isConfirming ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : `Confirm Top Up of $${Number(amount).toFixed(2)}`}
                </button>
                <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default TopUpModal;
