import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  ClipboardList,
  Wallet,
  Bell,
  Bot,
  ArrowRight,
  Plus,
  Clock,
  ShieldCheck,
  Sparkles,
  CalendarClock,
  Megaphone,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { StatusBadge, UrgencyBadge } from '@/components/dashboard/status-badge';
import { residentProfile, maintenanceRequests, walletSummary, transactions, notices } from '@/lib/mock/resident';

export const metadata: Metadata = {
  title: 'Resident Overview',
};

const quickActions = [
  { href: '/resident/maintenance?new=1', label: 'Report an Issue', description: 'Log a new maintenance request', icon: Plus, accent: 'bg-indigo-600' },
  { href: '/resident/wallet', label: 'Top Up Wallet', description: 'Add funds via M-Pesa or card', icon: Wallet, accent: 'bg-emerald-600' },
  { href: '/resident/ai', label: 'Ask AI Assistant', description: 'Diagnose an issue in seconds', icon: Bot, accent: 'bg-violet-600' },
  { href: '/resident/community', label: 'Building Notices', description: 'Catch up on what you missed', icon: Megaphone, accent: 'bg-amber-600' },
];

const activeRequests = maintenanceRequests.filter((r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');

export default function ResidentOverviewPage() {
  const stats: { icon: typeof ClipboardList; label: string; value: number; prefix?: string; suffix?: string }[] = [
    { icon: ClipboardList, label: 'Active Requests', value: activeRequests.length },
    { icon: Wallet, label: 'Wallet Balance', value: walletSummary.balance, prefix: 'KES ' },
    { icon: ShieldCheck, label: 'Held in Escrow', value: walletSummary.escrowHeld, prefix: 'KES ' },
    { icon: Bell, label: 'Unread Notices', value: notices.length },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {residentProfile.firstName} <span aria-hidden>👋</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {residentProfile.unit}, {residentProfile.building} — {residentProfile.neighborhood}
            </p>
          </div>
          <Link
            href="/resident/maintenance?new=1"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Report an Issue
          </Link>
        </div>
      </Reveal>

      {/* Stats */}
      <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, prefix, suffix }) => (
          <StaggerItem key={label}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <div className="mt-3 text-2xl font-bold text-slate-900">
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Quick actions */}
      <Reveal delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ href, label, description, icon: Icon, accent }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-lg ${accent} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{label}</h3>
              <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active requests */}
        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Active Maintenance Requests</h2>
              <Link href="/resident/maintenance" className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1">
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {activeRequests.map((request) => (
                <div key={request.id} className="px-6 py-4 flex items-center gap-4">
                  {request.technician ? (
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                      <Image src={request.technician.image} alt={request.technician.name} fill sizes="44px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{request.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{request.category}</span>
                      {request.technician && <span>· {request.technician.name}</span>}
                      {request.scheduledFor && (
                        <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                          <CalendarClock className="w-3 h-3" />
                          {request.scheduledFor}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <StatusBadge status={request.status} />
                    <UrgencyBadge urgency={request.urgency} />
                  </div>
                </div>
              ))}
              {activeRequests.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-slate-500">No active requests right now.</div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Wallet snapshot */}
          <Reveal delay={0.2}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div aria-hidden className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Wallet Balance</span>
                <Wallet className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="relative mt-2 text-3xl font-bold">
                KES {walletSummary.balance.toLocaleString()}
              </div>
              <p className="relative mt-1 text-xs text-indigo-200">
                + KES {walletSummary.escrowHeld.toLocaleString()} held in escrow
              </p>
              <Link
                href="/resident/wallet"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium bg-white/15 hover:bg-white/25 transition-colors px-3.5 py-2 rounded-md backdrop-blur-sm"
              >
                Manage Wallet
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* Recent transactions */}
          <Reveal delay={0.25}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {transactions.slice(0, 3).map((txn) => (
                  <div key={txn.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{txn.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {txn.date}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${txn.amount > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {txn.amount > 0 ? '+' : ''}
                      {txn.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Notices preview */}
          <Reveal delay={0.3}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Building Notices</h2>
                <Link href="/resident/community" className="text-xs font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {notices.slice(0, 2).map((notice) => (
                  <div key={notice.id} className="px-5 py-3.5">
                    <p className="text-xs font-semibold text-slate-800">{notice.title}</p>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{notice.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* AI callout */}
      <Reveal delay={0.35}>
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-8 sm:px-10">
          <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                MERGE AI Assistant
              </div>
              <h2 className="text-lg font-semibold text-white">Not sure what&apos;s wrong? Describe it and let AI triage it.</h2>
              <p className="mt-1 text-sm text-slate-400 max-w-md">
                Get an instant category, urgency estimate, and price range before you submit a request.
              </p>
            </div>
            <Link
              href="/resident/ai"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-md font-medium text-sm hover:bg-slate-100 hover:scale-[1.03] transition-all"
            >
              Ask the AI Assistant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
