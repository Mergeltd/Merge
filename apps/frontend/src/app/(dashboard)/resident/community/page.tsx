"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, ShieldAlert, Users, Receipt, Wrench, CalendarDays } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { notices, residentProfile, type Notice } from '@/lib/mock/resident';

const categoryMeta: Record<Notice['category'], { icon: typeof Megaphone; className: string }> = {
  Maintenance: { icon: Wrench, className: 'bg-amber-50 text-amber-600' },
  Security: { icon: ShieldAlert, className: 'bg-red-50 text-red-600' },
  Community: { icon: Users, className: 'bg-indigo-50 text-indigo-600' },
  Billing: { icon: Receipt, className: 'bg-emerald-50 text-emerald-600' },
};

const filters: (Notice['category'] | 'All')[] = ['All', 'Maintenance', 'Security', 'Community', 'Billing'];

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState<Notice['category'] | 'All'>('All');

  const filtered = useMemo(
    () => (activeFilter === 'All' ? notices : notices.filter((n) => n.category === activeFilter)),
    [activeFilter]
  );

  return (
    <div className="space-y-6 pb-12">
      <Reveal>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Community &amp; Notices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Everything happening at {residentProfile.building}, in one place.
          </p>
        </div>
      </Reveal>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                active ? 'text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="community-filter-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <StaggerGroup className="space-y-4">
          {filtered.map((notice) => {
            const meta = categoryMeta[notice.category];
            const Icon = meta.icon;
            return (
              <StaggerItem key={notice.id}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta.className}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-sm font-semibold text-slate-900">{notice.title}</h3>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.className}`}>
                          {notice.category}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{notice.body}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {notice.date}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">No notices in this category yet.</p>
        </div>
      )}
    </div>
  );
}
