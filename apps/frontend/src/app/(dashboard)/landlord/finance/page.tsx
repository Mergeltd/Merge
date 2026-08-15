import { Wallet, Receipt, Percent, TrendingUp, ArrowDownToLine } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { payoutSummary, payoutHistory, type PayoutTransaction } from '@/lib/mock/landlord';

const statusStyles: Record<PayoutTransaction['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  PAID: 'bg-emerald-50 text-emerald-700',
  FAILED: 'bg-red-50 text-red-600',
};

export default function LandlordFinancePage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
        <p className="mt-1 text-sm text-slate-500">Rent collected across your portfolio and your net payouts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
          <div aria-hidden className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Next Net Payout</span>
            <Wallet className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="relative mt-3 text-4xl font-bold">KES {payoutSummary.netPayout.toLocaleString()}</div>
          <p className="relative mt-1.5 text-sm text-indigo-200">Expected within 3 business days</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gross Rent Collected</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 text-4xl font-bold text-slate-900">KES {payoutSummary.grossRentCollected.toLocaleString()}</div>
          <p className="mt-1.5 text-sm text-slate-500">Across all occupied units this month</p>
        </div>
      </div>

      <StaggerGroup className="grid grid-cols-2 gap-4">
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <Percent className="w-4.5 h-4.5 text-slate-500" />
            </div>
            <div className="mt-3 text-xl font-bold text-slate-900">
              KES {payoutSummary.managementFee.toLocaleString()} <span className="text-sm font-medium text-slate-400">({payoutSummary.managementFeePct}%)</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Property management fee</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <ArrowDownToLine className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div className="mt-3 text-xl font-bold text-slate-900">KES {payoutSummary.pendingPayout.toLocaleString()}</div>
            <p className="mt-0.5 text-xs text-slate-500">Pending payout</p>
          </div>
        </StaggerItem>
      </StaggerGroup>

      <Reveal delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" />
              Payout History
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="px-6 py-4 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{payout.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{payout.date} · {payout.id}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[payout.status]}`}>
                  {payout.status.charAt(0) + payout.status.slice(1).toLowerCase()}
                </span>
                <span className="text-sm font-semibold text-emerald-600 shrink-0 w-28 text-right">
                  +{payout.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
