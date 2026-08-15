"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, ShieldCheck, Clock, AlertCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { revenueByMonth, financeSummary, transactions, type AdminTransaction } from '@/lib/mock/admin';

const statusStyles: Record<AdminTransaction['status'], string> = {
  SUCCESSFUL: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  FAILED: 'bg-red-50 text-red-600',
};

const stats = [
  { icon: TrendingUp, label: 'Monthly Revenue', value: financeSummary.monthlyRevenue, accent: 'text-indigo-600 bg-indigo-50' },
  { icon: ShieldCheck, label: 'Held in Escrow', value: financeSummary.escrowHeld, accent: 'text-sky-600 bg-sky-50' },
  { icon: Clock, label: 'Pending Payouts', value: financeSummary.pendingPayouts, accent: 'text-amber-600 bg-amber-50' },
  { icon: AlertCircle, label: 'Rent in Arrears', value: financeSummary.arrears, accent: 'text-red-600 bg-red-50' },
];

export default function AdminFinancePage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
        <p className="mt-1 text-sm text-slate-500">Revenue, escrow, and payouts across Kilimani Heights.</p>
      </div>

      <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, accent }) => (
          <StaggerItem key={label}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="mt-3 text-xl font-bold text-slate-900">
                <AnimatedCounter value={value} prefix="KES " />
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900">Revenue — Last 6 Months</h2>
          <div className="mt-4 h-64 w-full min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 50000', 'dataMax + 50000']}
                  tickFormatter={(v) => `${(v / 1e6).toFixed(2)}M`}
                  width={56}
                />
                <Tooltip
                  formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.map((txn) => (
              <div key={txn.id} className="px-6 py-3.5 flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    txn.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {txn.amount > 0 ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{txn.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{txn.date}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyles[txn.status]}`}>
                  {txn.status.charAt(0) + txn.status.slice(1).toLowerCase()}
                </span>
                <span className={`text-sm font-semibold shrink-0 w-28 text-right ${txn.amount > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {txn.amount > 0 ? '+' : ''}
                  {txn.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
