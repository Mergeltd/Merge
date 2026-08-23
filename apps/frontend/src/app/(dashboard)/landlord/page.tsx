'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  FileText,
  Wallet,
  Users,
  ArrowRight,
  Clock,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { useAuth } from '@/providers/auth-provider';
import { useLandlordContext, useMyProperties } from '@/hooks/use-landlord-context';
import { useMyVacancies } from '@/hooks/use-vacancies';
import { useMyApplications } from '@/hooks/use-applications';
import { useMyLandlordWallet } from '@/hooks/use-wallet';

export default function LandlordOverviewPage() {
  const { session, profile } = useAuth();
  const { data: landlordCtx } = useLandlordContext(session?.user.id);
  const { data: properties = [] } = useMyProperties(landlordCtx?.landlordId);
  const { data: vacancies = [] } = useMyVacancies(landlordCtx?.landlordId);
  const { data: applications = [] } = useMyApplications(!!session);
  const { data: wallet } = useMyLandlordWallet(session?.user.id);

  useEffect(() => {
    document.title = 'Landlord Overview';
  }, []);

  const totalUnits = properties.reduce((sum, p) => sum + p.units, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupied, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const publishedListings = vacancies.filter((v) => v.status === 'PUBLISHED');
  const pendingApplications = applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'REVIEWING');

  const quickActions = [
    { href: '/landlord/vacancies', label: 'Manage Vacancies', description: `${publishedListings.length} live listings`, icon: Building2, accent: 'bg-indigo-600' },
    { href: '/landlord/applications', label: 'Review Applications', description: `${pendingApplications.length} awaiting decision`, icon: FileText, accent: 'bg-amber-600' },
    { href: '/landlord/properties', label: 'View Properties', description: `${properties.length} properties in portfolio`, icon: Users, accent: 'bg-violet-600' },
    { href: '/landlord/finance', label: 'View Finance', description: 'Balance and transaction history', icon: Wallet, accent: 'bg-emerald-600' },
  ];

  const stats: { icon: typeof Building2; label: string; value: number; prefix?: string; suffix?: string }[] = [
    { icon: Building2, label: 'Properties', value: properties.length },
    { icon: Users, label: 'Portfolio Occupancy', value: occupancyRate, suffix: '%' },
    { icon: FileText, label: 'Pending Applications', value: pendingApplications.length },
    { icon: Wallet, label: 'Wallet Balance', value: wallet?.balance ?? 0, prefix: 'KES ' },
  ];

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
              {properties.length} properties · {totalUnits} units
            </p>
          </div>
          <Link
            href="/landlord/applications"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all shrink-0"
          >
            <FileText className="w-4 h-4" />
            Review Applications
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
        {/* Recent applications */}
        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Recent Applications</h2>
              <Link href="/landlord/applications" className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1">
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {app.applicantName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{app.applicantName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {app.employerName && (
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {app.employerName}
                        </span>
                      )}
                      <span>Applied for {app.vacancyTitle}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : app.status === 'DECLINED'
                          ? 'bg-red-50 text-red-600'
                          : app.status === 'REVIEWING'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
              {applications.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-slate-500">No applications yet.</div>
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
                <TrendingUp className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="relative mt-2 text-3xl font-bold">
                KES {(wallet?.balance ?? 0).toLocaleString()}
              </div>
              <Link
                href="/landlord/finance"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium bg-white/15 hover:bg-white/25 transition-colors px-3.5 py-2 rounded-md backdrop-blur-sm"
              >
                View Finance
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* Listings preview */}
          <Reveal delay={0.25}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Live Listings</h2>
                <Link href="/landlord/vacancies" className="text-xs font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {publishedListings.map((listing) => (
                  <div key={listing.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{listing.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{listing.applicantCount} applicants</p>
                    </div>
                  </div>
                ))}
                {publishedListings.length === 0 && (
                  <div className="px-5 py-6 text-center text-xs text-slate-500">No live listings right now.</div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Properties preview */}
          <Reveal delay={0.3}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Portfolio</h2>
                <Link href="/landlord/properties" className="text-xs font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="px-5 py-3">
                    <p className="text-xs font-semibold text-slate-800">{property.name}</p>
                    <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {property.occupied}/{property.units} occupied · {property.neighborhood}
                    </p>
                  </div>
                ))}
                {properties.length === 0 && (
                  <div className="px-5 py-6 text-center text-xs text-slate-500">No properties yet.</div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
