"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, Star, ShieldCheck, Ban, Clock } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { technicians as initialTechnicians, type AdminTechnician, type TechVerificationStatus } from '@/lib/mock/admin';

const categories = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC'];

const statusMeta: Record<TechVerificationStatus, { label: string; className: string; icon: typeof ShieldCheck }> = {
  VERIFIED: { label: 'Verified', className: 'bg-emerald-50 text-emerald-700', icon: ShieldCheck },
  PENDING_VERIFICATION: { label: 'Pending', className: 'bg-amber-50 text-amber-700', icon: Clock },
  SUSPENDED: { label: 'Suspended', className: 'bg-red-50 text-red-600', icon: Ban },
};

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<AdminTechnician[]>(initialTechnicians);
  const [activeCategory, setActiveCategory] = useState('All');

  const pending = technicians.filter((t) => t.verificationStatus === 'PENDING_VERIFICATION');
  const roster = useMemo(
    () =>
      technicians
        .filter((t) => t.verificationStatus !== 'PENDING_VERIFICATION')
        .filter((t) => activeCategory === 'All' || t.category === activeCategory),
    [technicians, activeCategory]
  );

  const decide = (id: string, status: TechVerificationStatus) => {
    setTechnicians((prev) => prev.map((t) => (t.id === id ? { ...t, verificationStatus: status } : t)));
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Technicians</h1>
        <p className="mt-1 text-sm text-slate-500">Verify new applicants and manage your marketplace roster.</p>
      </div>

      {/* Verification queue */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Verification Queue ({pending.length})</h2>
        <AnimatePresence mode="popLayout">
          {pending.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pending.map((tech) => (
                <motion.div
                  key={tech.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {tech.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-900">{tech.name}</h3>
                      <p className="text-xs text-slate-500">{tech.category} · Applied {tech.submittedAt}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => decide(tech.id, 'VERIFIED')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(tech.id, 'SUSPENDED')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-10 text-center">
              <ShieldCheck className="w-7 h-7 text-slate-300 mx-auto" />
              <p className="mt-2 text-sm text-slate-500">All caught up — no pending verifications.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Roster */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Roster</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`relative px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    active ? 'text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="tech-category-pill"
                      className="absolute inset-0 rounded-full bg-indigo-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roster.map((tech) => {
            const meta = statusMeta[tech.verificationStatus];
            const StatusIcon = meta.icon;
            return (
              <StaggerItem key={tech.id}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    {tech.image ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                        <Image src={tech.image} alt={tech.name} fill sizes="44px" className="object-cover" />
                      </div>
                    ) : (
                      <span className="w-11 h-11 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                        {tech.initials}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{tech.name}</h3>
                      <p className="text-xs text-slate-500">{tech.category}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {meta.label}
                    </span>
                    {tech.averageRating > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {tech.averageRating.toFixed(1)} · {tech.jobsCompleted} jobs
                      </span>
                    )}
                  </div>
                  {tech.verificationStatus === 'VERIFIED' && (
                    <button
                      type="button"
                      onClick={() => decide(tech.id, 'SUSPENDED')}
                      className="mt-3 w-full py-1.5 text-xs font-medium text-red-600 border border-red-100 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Suspend
                    </button>
                  )}
                  {tech.verificationStatus === 'SUSPENDED' && (
                    <button
                      type="button"
                      onClick={() => decide(tech.id, 'VERIFIED')}
                      className="mt-3 w-full py-1.5 text-xs font-medium text-emerald-600 border border-emerald-100 rounded-md hover:bg-emerald-50 transition-colors"
                    >
                      Reinstate
                    </button>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </div>
  );
}
