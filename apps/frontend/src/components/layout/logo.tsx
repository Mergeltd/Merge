"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 group', className)}>
      <motion.span
        whileHover={{ rotate: -8, scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative bg-indigo-600 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-700 transition-colors overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
        <Building2 className="relative text-white w-5 h-5" />
      </motion.span>
      <span className={cn('text-lg font-bold tracking-tight', dark ? 'text-white' : 'text-slate-900')}>
        MERGE
      </span>
    </Link>
  );
}
