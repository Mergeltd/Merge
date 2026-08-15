import Link from 'next/link';
import type { Metadata } from 'next';
import {
  CalendarCheck,
  Wallet,
  Star,
  ListChecks,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { UrgencyBadge } from '@/components/dashboard/status-badge';
import { BookingStatusBadge } from '@/components/dashboard/booking-status-badge';
import { technicianProfile, bookings, availableJobs, earningsSummary, reviews } from '@/lib/mock/technician';

export const metadata: Metadata = {
  title: 'Technician Overview',
};

const activeBookings = bookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

const quickActions = [
  { href: '/technician/jobs', label: 'Browse Job Board', description: `${availableJobs.length} open jobs nearby`, icon: ListChecks, accent: 'bg-indigo-600' },
  { href: '/technician/bookings', label: 'My Bookings', description: `${activeBookings.length} active bookings`, icon: CalendarCheck, accent: 'bg-violet-600' },
  { href: '/technician/earnings', label: 'Earnings', description: 'View payouts and withdraw', icon: Wallet, accent: 'bg-emerald-600' },
  { href: '/technician/reviews', label: 'Reviews', description: `${technicianProfile.reviewCount} reviews`, icon: Star, accent: 'bg-amber-600' },
];

export default function TechnicianOverviewPage() {
  const stats: { icon: typeof CalendarCheck; label: string; value: number; prefix?: string; suffix?: string }[] = [
    { icon: CalendarCheck, label: 'Active Bookings', value: activeBookings.length },
    { icon: Wallet, label: 'Available Balance', value: earningsSummary.availableBalance, prefix: 'KES ' },
    { icon: Star, label: 'Average Rating', value: technicianProfile.averageRating, suffix: ' / 5' },
    { icon: ListChecks, label: 'Jobs Completed', value: technicianProfile.jobsCompleted },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {technicianProfile.firstName} <span aria-hidden>👋</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {technicianProfile.category} · {technicianProfile.location} ·{' '}
              <span className={technicianProfile.isAvailable ? 'text-emerald-600 font-medium' : 'text-slate-400 font-medium'}>
                {technicianProfile.isAvailable ? 'Available for jobs' : 'Not accepting jobs'}
              </span>
            </p>
          </div>
          <Link
            href="/technician/jobs"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all shrink-0"
          >
            <ListChecks className="w-4 h-4" />
            Browse Job Board
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
        {/* Active bookings */}
        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Today &amp; Upcoming</h2>
              <Link href="/technician/bookings" className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1">
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {activeBookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{booking.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{booking.resident}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Unit {booking.unit}, {booking.building}
                      </span>
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                        <Clock className="w-3 h-3" />
                        {booking.scheduledFor}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <BookingStatusBadge status={booking.status} />
                    <UrgencyBadge urgency={booking.urgency} />
                  </div>
                </div>
              ))}
              {activeBookings.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-slate-500">No active bookings right now.</div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Earnings snapshot */}
          <Reveal delay={0.2}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div aria-hidden className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Available Balance</span>
                <Wallet className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="relative mt-2 text-3xl font-bold">
                KES {earningsSummary.availableBalance.toLocaleString()}
              </div>
              <p className="relative mt-1 text-xs text-indigo-200">
                + KES {earningsSummary.pendingPayout.toLocaleString()} pending payout
              </p>
              <Link
                href="/technician/earnings"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium bg-white/15 hover:bg-white/25 transition-colors px-3.5 py-2 rounded-md backdrop-blur-sm"
              >
                Manage Earnings
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* Job board preview */}
          <Reveal delay={0.25}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Nearby Open Jobs</h2>
                <Link href="/technician/jobs" className="text-xs font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {availableJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="px-5 py-3">
                    <p className="text-xs font-semibold text-slate-800 truncate">{job.title}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {job.neighborhood} · {job.distanceKm} km · KES {job.estimatedPayout.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Recent reviews */}
          <Reveal delay={0.3}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Recent Reviews</h2>
                <Link href="/technician/reviews" className="text-xs font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800">{review.resident}</p>
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {review.rating}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Availability callout */}
      <Reveal delay={0.35}>
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-8 sm:px-10">
          <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Stay Visible
              </div>
              <h2 className="text-lg font-semibold text-white">Keep your profile sharp to win more bookings.</h2>
              <p className="mt-1 text-sm text-slate-400 max-w-md">
                Toggle availability, update your skills, and manage certifications from your profile.
              </p>
            </div>
            <Link
              href="/technician/profile"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-md font-medium text-sm hover:bg-slate-100 hover:scale-[1.03] transition-all"
            >
              Manage Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
