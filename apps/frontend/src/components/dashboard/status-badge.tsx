import { cn } from '@/lib/utils';

export type RequestStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type RequestUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const statusStyles: Record<RequestStatus, { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'bg-slate-100 text-slate-600' },
  ASSIGNED: { label: 'Assigned', className: 'bg-sky-50 text-sky-700' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-amber-50 text-amber-700' },
  COMPLETED: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-600' },
};

const urgencyStyles: Record<RequestUrgency, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'bg-slate-100 text-slate-500' },
  MEDIUM: { label: 'Medium', className: 'bg-sky-50 text-sky-600' },
  HIGH: { label: 'High', className: 'bg-orange-50 text-orange-600' },
  CRITICAL: { label: 'Critical', className: 'bg-red-50 text-red-600' },
};

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const style = statusStyles[status];
  return (
    <span className={cn('inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full', style.className, className)}>
      {style.label}
    </span>
  );
}

export function UrgencyBadge({ urgency, className }: { urgency: RequestUrgency; className?: string }) {
  const style = urgencyStyles[urgency];
  return (
    <span className={cn('inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full', style.className, className)}>
      {style.label}
    </span>
  );
}
