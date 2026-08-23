"use client";

import { useMemo, useState } from 'react';
import { Search, Mail, Phone, CalendarRange, Users, Loader2 } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { useAllResidents } from '@/hooks/use-resident-context';
import { getInitials } from '@/lib/utils';
import type { AdminResident } from '@/queries/residents';

const statusStyles: Record<AdminResident['status'], string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-sky-50 text-sky-700',
  SUSPENDED: 'bg-red-50 text-red-600',
  DEACTIVATED: 'bg-slate-100 text-slate-500',
};

export default function AdminResidentsPage() {
  const { data: residents = [], isLoading } = useAllResidents();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return residents;
    return residents.filter(
      (r: AdminResident) => r.name.toLowerCase().includes(q) || r.unit.toLowerCase().includes(q) || r.building.toLowerCase().includes(q)
    );
  }, [residents, query]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Residents</h1>
          <p className="mt-1 text-sm text-slate-500">{residents.length} residents.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or unit..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((resident) => (
            <StaggerItem key={resident.id}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {getInitials(resident.firstName, resident.lastName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="text-sm font-semibold text-slate-900">{resident.name}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[resident.status]}`}>
                        {resident.status.charAt(0) + resident.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Unit {resident.unit} · {resident.building}
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {resident.email}
                      </p>
                      {resident.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          {resident.phone}
                        </p>
                      )}
                      {(resident.leaseStart || resident.leaseEnd) && (
                        <p className="flex items-center gap-1.5">
                          <CalendarRange className="w-3.5 h-3.5 shrink-0" />
                          Lease: {resident.leaseStart ?? '—'} – {resident.leaseEnd ?? '—'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <Users className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">No residents match your search.</p>
        </div>
      )}
    </div>
  );
}
