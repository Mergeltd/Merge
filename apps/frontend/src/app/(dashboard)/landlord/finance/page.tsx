"use client";

import { Wallet, Receipt } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { useAuth } from '@/providers/auth-provider';
import { useMyLandlordWallet, useWalletTransactions } from '@/hooks/use-wallet';
import type { WalletTransaction } from '@/queries/wallets';

const statusStyles: Record<WalletTransaction['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  SUCCESSFUL: 'bg-emerald-50 text-emerald-700',
  FAILED: 'bg-red-50 text-red-600',
  REVERSED: 'bg-slate-100 text-slate-600',
};

export default function LandlordFinancePage() {
  const { session } = useAuth();
  const { data: wallet } = useMyLandlordWallet(session?.user.id);
  const { data: transactions = [], isLoading } = useWalletTransactions(wallet?.walletId);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
        <p className="mt-1 text-sm text-slate-500">Your wallet balance and transaction history.</p>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white max-w-md">
        <div aria-hidden className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Wallet Balance</span>
          <Wallet className="w-5 h-5 text-indigo-200" />
        </div>
        <div className="relative mt-3 text-4xl font-bold">KES {(wallet?.balance ?? 0).toLocaleString()}</div>
      </div>

      <Reveal delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" />
              Transaction History
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.map((txn) => (
              <div key={txn.id} className="px-6 py-4 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{txn.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{txn.date} · {txn.id}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[txn.status]}`}>
                  {txn.status.charAt(0) + txn.status.slice(1).toLowerCase()}
                </span>
                <span className={`text-sm font-semibold shrink-0 w-28 text-right ${txn.amount > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {txn.amount > 0 ? '+' : ''}
                  {txn.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {!isLoading && transactions.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-slate-500">No transactions yet.</div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
