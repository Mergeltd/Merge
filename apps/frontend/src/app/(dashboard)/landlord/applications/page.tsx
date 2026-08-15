"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Banknote, Check, X, FileText, Eye } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { applications as initialApplications, type VacancyApplication, type ApplicationStatus } from '@/lib/mock/landlord';

const filters: { label: string; value: ApplicationStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Reviewing', value: 'REVIEWING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Declined', value: 'DECLINED' },
];

const statusStyles: Record<ApplicationStatus, string> = {
  SUBMITTED: 'bg-slate-100 text-slate-600',
  REVIEWING: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  DECLINED: 'bg-red-50 text-red-600',
};

export default function LandlordApplicationsPage() {
  const [applications, setApplications] = useState<VacancyApplication[]>(initialApplications);
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'ALL'>('ALL');

  const filtered = useMemo(
    () => (activeFilter === 'ALL' ? applications : applications.filter((a) => a.status === activeFilter)),
    [applications, activeFilter]
  );

  const decide = (id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-500">Review and decide on every tenant application across your listings.</p>
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
                  layoutId="landlord-application-filter-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <StaggerGroup className="space-y-4">
          {filtered.map((app) => (
            <StaggerItem key={app.id}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {app.applicantInitials}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{app.applicantName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <FileText className="w-3.5 h-3.5" />
                          Applied for {app.vacancyTitle}
                        </p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[app.status]}`}>
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {app.employerName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" />
                        KES {app.monthlyIncome.toLocaleString()}/mo income
                      </span>
                      <span>Applied {app.appliedAt}</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{app.notes}</p>

                    {(app.status === 'SUBMITTED' || app.status === 'REVIEWING') && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {app.status === 'SUBMITTED' && (
                          <button
                            type="button"
                            onClick={() => decide(app.id, 'REVIEWING')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Mark Reviewing
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => decide(app.id, 'APPROVED')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => decide(app.id, 'DECLINED')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">No applications match this filter.</p>
        </div>
      )}
    </div>
  );
}
