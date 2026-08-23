"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, CheckCircle2, ListChecks } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { UrgencyBadge, type RequestUrgency } from '@/components/dashboard/status-badge';
import { useAuth } from '@/providers/auth-provider';
import { useTechnicianContext } from '@/hooks/use-technician-context';
import { useOpenJobs } from '@/hooks/use-open-jobs';
import { useAcceptJob } from '@/hooks/use-open-jobs';
import { toUserMessage } from '@/lib/errors';

const urgencyFilters: { label: string; value: RequestUrgency | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' },
];

export default function TechnicianJobBoardPage() {
  const { session } = useAuth();
  const { data: techCtx } = useTechnicianContext(session?.user.id);
  const { data: jobs = [], isLoading } = useOpenJobs();
  const acceptJob = useAcceptJob(techCtx?.id);
  const [activeFilter, setActiveFilter] = useState<RequestUrgency | 'ALL'>('ALL');
  const [error, setError] = useState<string | null>(null);

  const filteredJobs = useMemo(
    () => (activeFilter === 'ALL' ? jobs : jobs.filter((j) => j.urgency === activeFilter)),
    [activeFilter, jobs]
  );

  const handleAccept = (requestId: string) => {
    setError(null);
    // Scheduling itself (letting the technician pick a time) isn't built
    // yet — defaults to 24h out so the booking has a valid, non-null
    // scheduled_at. A real time picker is a natural Phase 8 follow-up,
    // not blocked on anything else.
    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    acceptJob.mutate(
      { requestId, scheduledAt },
      { onError: (err) => setError(toUserMessage(err)) }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Job Board</h1>
        <p className="mt-1 text-sm text-slate-500">Open jobs ready to accept.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {urgencyFilters.map((f) => {
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
                  layoutId="job-board-filter-pill"
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

      {filteredJobs.length > 0 ? (
        <StaggerGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const isPending = acceptJob.isPending && acceptJob.variables?.requestId === job.id;
            return (
              <StaggerItem key={job.id}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-mono text-slate-400">{job.id.slice(0, 8)}</p>
                    <UrgencyBadge urgency={job.urgency} />
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900">{job.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed flex-1">{job.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.building}{job.neighborhood ? `, ${job.neighborhood}` : ''}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Posted {job.postedAt}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-500">{job.category}</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleAccept(job.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 disabled:opacity-60"
                    >
                      {isPending ? (
                        'Accepting…'
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accept Job
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <ListChecks className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">
            {isLoading ? 'Loading…' : 'No open jobs match this filter.'}
          </p>
        </div>
      )}
    </div>
  );
}
