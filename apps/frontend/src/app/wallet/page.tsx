"use client";
import React from 'react';
import { WalletDashboard } from '../../components/wallets/wallet-dashboard';
import { PaymentMethodSelector } from '../../components/payments/payment-method-selector';

export default function WalletPage() {
  const handlePayment = (method: 'MPESA' | 'STRIPE') => {
    alert(`Initiating ${method} checkout...`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">My Wallet</h1>
      <WalletDashboard />
      
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Add Funds</h2>
        <PaymentMethodSelector onSelect={handlePayment} />
      </div>
    </div>
  );
}
