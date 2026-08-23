"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, CalendarCheck, Navigation, Wrench, CheckCircle2, X } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { UrgencyBadge } from '@/components/dashboard/status-badge';
import { BookingStatusBadge } from '@/components/dashboard/booking-status-badge';
import type { BookingStatus } from '@/queries/bookings';
import { useAuth } from '@/providers/auth-provider';
import { useTechnicianContext } from '@/hooks/use-technician-context';
import { useMyBookings, useMyBookingsRealtime, useUpdateBookingStatus } from '@/hooks/use-bookings';
import { toUserMessage } from '@/lib/errors';

const filters: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'New', value: 'PROPOSED' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'En Route', value: 'IN_ROUTE' },
  { label: 'In Progress', value: 'WORK_STARTED' },
  { label: 'Completed', value: 'COMPLETED' },
];

const nextStatus: Partial<Record<BookingStatus, { label: string; status: BookingStatus; icon: typeof Navigation }>> = {
  ACCEPTED: { label: 'Mark En Route', status: 'IN_ROUTE', icon: Navigation },
  IN_ROUTE: { label: 'Start Work', status: 'WORK_STARTED', icon: Wrench },
  WORK_STARTED: { label: 'Mark Complete', status: 'COMPLETED', icon: CheckCircle2 },
};

export default function TechnicianBookingsPage() {
  const { session } = useAuth();
  const { data: techCtx } = useTechnicianContext(session?.user.id);
  const { data: bookings = [], isLoading } = useMyBookings(techCtx?.id);
  useMyBookingsRealtime(techCtx?.id);
  const updateStatus = useUpdateBookingStatus(techCtx?.id);
  const [activeFilter, setActiveFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [error, setError] = useState<string | null>(null);

  const filteredBookings = useMemo(
    () => (activeFilter === 'ALL' ? bookings : bookings.filter((b) => b.status === activeFilter)),
    [bookings, activeFilter]
  );

  const handleUpdate = (bookingId: string, status: BookingStatus) => {
    setError(null);
    updateStatus.mutate(
      { bookingId, status: status as 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'IN_ROUTE' | 'WORK_STARTED' | 'COMPLETED' },
      { onError: (err) => setError(toUserMessage(err)) }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">Track every job from acceptance to completion.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = activeFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                active ? 'text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tech-bookings-filter-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {filteredBookings.length > 0 ? (
        <StaggerGroup className="space-y-4">
          {filteredBookings.map((booking) => {
            const action = nextStatus[booking.status];
            return (
              <StaggerItem key={booking.id}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-mono text-slate-400">{booking.id.slice(0, 8)}</p>
                          <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{booking.title}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <BookingStatusBadge status={booking.status} />
                          <UrgencyBadge urgency={booking.urgency} />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                        <span className="font-medium text-slate-600">{booking.resident}</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          Unit {booking.unit}, {booking.building}
                        </span>
                        <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.scheduledFor}
                        </span>
                        <span className="font-semibold text-slate-700">KES {booking.totalAmount.toLocaleString()}</span>
                      </div>

                      {booking.status === 'PROPOSED' && (
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdate(booking.id, 'ACCEPTED')}
                            disabled={updateStatus.isPending}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdate(booking.id, 'DECLINED')}
                            disabled={updateStatus.isPending}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60"
                          >
                            <X className="w-3.5 h-3.5" />
                            Decline
                          </button>
                        </div>
                      )}

                      {action && (
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdate(booking.id, action.status)}
                            disabled={updateStatus.isPending}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                          >
                            <action.icon className="w-3.5 h-3.5" />
                            {action.label}
                          </button>
                          {booking.status === 'ACCEPTED' && (
                            <button
                              type="button"
                              onClick={() => handleUpdate(booking.id, 'CANCELLED')}
                              disabled={updateStatus.isPending}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">
            {isLoading ? 'Loading…' : 'No bookings match this filter.'}
          </p>
        </div>
      )}
    </div>
  );
}
