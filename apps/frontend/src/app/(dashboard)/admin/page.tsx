"use client";

import Link from 'next/link';
import {
  Building2,
  Users,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Clock,
  TrendingUp,
  UserPlus,
  Wallet,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { StatusBadge, UrgencyBadge } from '@/components/dashboard/status-badge';
import { useAuth } from '@/providers/auth-provider';
import { useProfile } from '@/hooks/use-profile';
import { useAllMaintenanceRequests } from '@/hooks/use-maintenance-requests';
import { useAllTechnicians } from '@/hooks/use-technician-context';
import { useAllBuildings } from '@/hooks/use-units';
import { useAdminOverviewStats, useAdminFinanceSummary, useRecentActivity } from '@/hooks/use-admin-stats';
import { getInitials } from '@/lib/utils';

export default function AdminOverviewPage() {
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);
  const { data: stats, isLoading: statsLoading } = useAdminOverviewStats();
  const { data: buildings = [] } = useAllBuildings();
  const { data: requests = [] } = useAllMaintenanceRequests();
  const { data: technicians = [] } = useAllTechnicians();
  const { data: finance } = useAdminFinanceSummary();
  const { data: activity = [] } = useRecentActivity();

  const pendingTechs = technicians.filter((t) => t.verificationStatus === 'PENDING_VERIFICATION');
  const urgentRequests = requests.filter((r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED').slice(0, 5);

  const quickActions = [
    { href: '/admin/technicians', label: 'Review Verifications', description: `${pendingTechs.length} technicians awaiting approval`, icon: UserPlus, accent: 'bg-indigo-600' },
    { href: '/admin/maintenance', label: 'Maintenance Queue', description: `${stats?.openRequests ?? 0} requests need attention`, icon: Wrench, accent: 'bg-amber-600' },
    { href: '/admin/properties', label: 'Manage Units', description: 'View occupancy across all blocks', icon: Building2, accent: 'bg-violet-600' },
    { href: '/admin/finance', label: 'View Finance', description: 'Revenue, escrow & payouts', icon: Wallet, accent: 'bg-emerald-600' },
  ];

  const statTiles: { icon: typeof Building2; label: string; value: number; suffix?: string }[] = [
    { icon: Building2, label: 'Occupancy Rate', value: stats?.occupancyRate ?? 0, suffix: '%' },
    { icon: Users, label: 'Active Residents', value: stats?.activeResidents ?? 0 },
    { icon: Wrench, label: 'Open Requests', value: stats?.openRequests ?? 0 },
    { icon: ShieldCheck, label: 'Pending Verifications', value: stats?.pendingVerifications ?? 0 },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {profile?.first_name ?? '…'} <span aria-hidden>👋</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {stats?.totalUnits ?? 0} units across {buildings.length} blocks
            </p>
          </div>
          <Link
            href="/admin/technicians"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            Review Verifications
          </Link>
        </div>
      </Reveal>

      {/* Stats */}
      <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statTiles.map(({ icon: Icon, label, value, suffix }) => (
          <StaggerItem key={label}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <div className="mt-3 text-2xl font-bold text-slate-900">
                <AnimatedCounter value={value} suffix={suffix} />
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
        {/* Urgent requests */}
        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Needs Attention</h2>
              <Link href="/admin/maintenance" className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1">
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {urgentRequests.map((request) => (
                <div key={request.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Wrench className="w-4.5 h-4.5 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{request.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>
                        Unit {request.unit}, {request.building}
                      </span>
                      <span>· {request.resident}</span>
                      {request.technician && <span>· {request.technician}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <StatusBadge status={request.status} />
                    <UrgencyBadge urgency={request.urgency} />
                  </div>
                </div>
              ))}
              {urgentRequests.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-slate-500">Nothing needs attention right now.</div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Revenue snapshot */}
          <Reveal delay={0.2}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div aria-hidden className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Monthly Revenue</span>
                <TrendingUp className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="relative mt-2 text-3xl font-bold">
                KES {(finance?.monthlyRevenue ?? 0).toLocaleString()}
              </div>
              <p className="relative mt-1 text-xs text-indigo-200">
                + KES {(finance?.escrowHeld ?? 0).toLocaleString()} held in escrow
              </p>
              <Link
                href="/admin/finance"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium bg-white/15 hover:bg-white/25 transition-colors px-3.5 py-2 rounded-md backdrop-blur-sm"
              >
                View Finance
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* Verification queue preview */}
          <Reveal delay={0.25}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Verification Queue</h2>
                <Link href="/admin/technicians" className="text-xs font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {pendingTechs.map((tech) => (
                  <div key={tech.id} className="px-5 py-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {getInitials(tech.firstName, tech.lastName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 truncate">{tech.name}</p>
                      <p className="text-[11px] text-slate-400">{tech.category}</p>
                    </div>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  </div>
                ))}
                {pendingTechs.length === 0 && (
                  <div className="px-5 py-6 text-center text-xs text-slate-500">No pending verifications.</div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Activity feed */}
          <Reveal delay={0.3}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {activity.map((entry) => (
                  <div key={entry.id} className="px-5 py-3">
                    <p className="text-xs text-slate-700 leading-relaxed">{entry.message}</p>
                    <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.timestamp}
                    </p>
                  </div>
                ))}
                {activity.length === 0 && (
                  <div className="px-5 py-6 text-center text-xs text-slate-500">No recent activity yet.</div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
