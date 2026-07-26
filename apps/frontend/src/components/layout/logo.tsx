import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 group', className)}>
      <span className="bg-indigo-600 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-700 transition-colors">
        <Building2 className="text-white w-5 h-5" />
      </span>
      <span className={cn('text-lg font-bold tracking-tight', dark ? 'text-white' : 'text-slate-900')}>
        MERGE
      </span>
    </Link>
  );
}
