"use client";

import { useMemo, useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, CalendarClock, MessageSquareText, ClipboardList } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { StatusBadge, UrgencyBadge, type RequestStatus } from '@/components/dashboard/status-badge';
import { NewRequestModal } from '@/components/maintenance/new-request-modal';
import { maintenanceRequests } from '@/lib/mock/resident';

const filters: { label: string; value: RequestStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<RequestStatus | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(searchParams.get('new') === '1');

  const filteredRequests = useMemo(
    () =>
      activeFilter === 'ALL'
        ? maintenanceRequests
        : maintenanceRequests.filter((r) => r.status === activeFilter),
    [activeFilter]
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="mt-1 text-sm text-slate-500">Track every job from submitted to resolved.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
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
                  layoutId="maintenance-filter-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>

      {filteredRequests.length > 0 ? (
        <StaggerGroup className="space-y-4">
          {filteredRequests.map((request) => (
            <StaggerItem key={request.id}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {request.technician ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                      <Image src={request.technician.image} alt={request.technician.name} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5 text-slate-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-mono text-slate-400">{request.id}</p>
                        <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{request.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <StatusBadge status={request.status} />
                        <UrgencyBadge urgency={request.urgency} />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-600">{request.category}</span>
                      <span>Submitted {request.createdAt}</span>
                      {request.technician && <span>Assigned to {request.technician.name}</span>}
                      {request.scheduledFor && (
                        <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                          <CalendarClock className="w-3.5 h-3.5" />
                          {request.scheduledFor}
                        </span>
                      )}
                    </div>

                    {request.technician && request.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" />
                        Message {request.technician.name.split(' ')[0]}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">No requests match this filter.</p>
        </div>
      )}

      <NewRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={null}>
      <MaintenanceContent />
    </Suspense>
  );
}
