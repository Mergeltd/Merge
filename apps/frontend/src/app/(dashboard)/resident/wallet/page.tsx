"use client";

import { useState } from 'react';
import { Wallet, ShieldCheck, ArrowDownToLine, ArrowUpToLine, Plus, Receipt } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { TopUpModal } from '@/components/wallets/top-up-modal';
import { useAuth } from '@/providers/auth-provider';
import { useResidentContext } from '@/hooks/use-resident-context';
import { useMyWallet, useWalletTransactions } from '@/hooks/use-wallet';
import type { WalletTransaction } from '@/queries/wallets';

const typeStyles: Record<string, { label: string; icon: typeof ArrowDownToLine; className: string }> = {
  deposit: { label: 'Deposit', icon: ArrowDownToLine, className: 'bg-emerald-50 text-emerald-600' },
  service_charge: { label: 'Service Charge', icon: ArrowUpToLine, className: 'bg-slate-100 text-slate-500' },
  maintenance_escrow: { label: 'Escrow Hold', icon: ShieldCheck, className: 'bg-amber-50 text-amber-600' },
  refund: { label: 'Refund', icon: ArrowDownToLine, className: 'bg-sky-50 text-sky-600' },
};

const statusStyles: Record<WalletTransaction['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  SUCCESSFUL: 'bg-emerald-50 text-emerald-700',
  FAILED: 'bg-red-50 text-red-600',
  REVERSED: 'bg-slate-100 text-slate-600',
};

export default function WalletPage() {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const { session } = useAuth();
  const { data: residentCtx } = useResidentContext(session?.user.id);
  const { data: wallet } = useMyWallet(residentCtx?.id);
  const { data: transactions = [], isLoading } = useWalletTransactions(wallet?.walletId);

  return (
    <div className="space-y-6 pb-12">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Wallet</h1>
            <p className="mt-1 text-sm text-slate-500">Fund maintenance jobs and building charges securely.</p>
          </div>
          <button
            type="button"
            onClick={() => setTopUpOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Top Up Wallet
          </button>
        </div>
      </Reveal>

      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StaggerItem>
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white h-full">
            <div aria-hidden className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Resident Wallet</span>
              <Wallet className="w-5 h-5 text-indigo-200" />
            </div>
            <div className="relative mt-3 text-4xl font-bold">KES {(wallet?.balance ?? 0).toLocaleString()}</div>
            <p className="relative mt-1.5 text-sm text-indigo-200">Available for jobs, bookings, and charges</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Held in Escrow</span>
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-3 text-4xl font-bold text-slate-900">KES {(wallet?.escrowHeld ?? 0).toLocaleString()}</div>
            <p className="mt-1.5 text-sm text-slate-500">Released to your technician once the job is confirmed done</p>
          </div>
        </StaggerItem>
      </StaggerGroup>

      <Reveal delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" />
              Transaction History
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.map((txn) => {
              const type = typeStyles[txn.type] ?? { label: txn.type, icon: ArrowUpToLine, className: 'bg-slate-100 text-slate-500' };
              const Icon = type.icon;
              return (
                <div key={txn.id} className="px-6 py-4 flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${type.className}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{txn.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{txn.date} · {txn.id}</p>
                  </div>
                  <span className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[txn.status]}`}>
                    {txn.status === 'SUCCESSFUL' ? 'Successful' : txn.status === 'PENDING' ? 'Pending' : txn.status === 'FAILED' ? 'Failed' : 'Reversed'}
                  </span>
                  <span className={`text-sm font-semibold shrink-0 w-24 text-right ${txn.amount > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {txn.amount > 0 ? '+' : ''}
                    {txn.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
            {!isLoading && transactions.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-slate-500">No transactions yet.</div>
            )}
          </div>
        </div>
      </Reveal>

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </div>
  );
}
