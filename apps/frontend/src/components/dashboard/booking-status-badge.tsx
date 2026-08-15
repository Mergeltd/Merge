import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/lib/mock/technician';

const styles: Record<BookingStatus, { label: string; className: string }> = {
  PROPOSED: { label: 'New Request', className: 'bg-violet-50 text-violet-700' },
  ACCEPTED: { label: 'Accepted', className: 'bg-sky-50 text-sky-700' },
  IN_ROUTE: { label: 'En Route', className: 'bg-indigo-50 text-indigo-700' },
  WORK_STARTED: { label: 'In Progress', className: 'bg-amber-50 text-amber-700' },
  COMPLETED: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-600' },
};

export function BookingStatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  const style = styles[status];
  return (
    <span className={cn('inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full', style.className, className)}>
      {style.label}
    </span>
  );
}
