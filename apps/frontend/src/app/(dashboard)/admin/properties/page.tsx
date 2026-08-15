"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Home, Wrench, User } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { buildings, units, type UnitStatus } from '@/lib/mock/admin';

const buildingFilters = ['All', ...buildings.map((b) => b.name)];
const statusFilters: { label: string; value: UnitStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Occupied', value: 'OCCUPIED' },
  { label: 'Vacant', value: 'VACANT' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
];

const statusStyles: Record<UnitStatus, string> = {
  OCCUPIED: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  VACANT: 'bg-sky-50 border-sky-200 text-sky-700',
  MAINTENANCE: 'bg-amber-50 border-amber-200 text-amber-700',
};

export default function AdminPropertiesPage() {
  const [activeBuilding, setActiveBuilding] = useState('All');
  const [activeStatus, setActiveStatus] = useState<UnitStatus | 'ALL'>('ALL');

  const filteredUnits = useMemo(
    () =>
      units.filter(
        (u) => (activeBuilding === 'All' || u.building === activeBuilding) && (activeStatus === 'ALL' || u.status === activeStatus)
      ),
    [activeBuilding, activeStatus]
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
        <p className="mt-1 text-sm text-slate-500">Occupancy across every block and unit at Kilimani Heights.</p>
      </div>

      {/* Building summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {buildings.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Building2 className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500">{b.occupied}/{b.units} occupied</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">{b.name}</h3>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${Math.round((b.occupied / b.units) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {buildingFilters.map((b) => {
            const active = activeBuilding === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setActiveBuilding(b)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active ? 'text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="building-filter-pill"
                    className="absolute inset-0 rounded-full bg-indigo-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{b}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => {
            const active = activeStatus === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setActiveStatus(s.value)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active ? 'text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="status-filter-pill"
                    className="absolute inset-0 rounded-full bg-slate-800"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Units grid */}
      {filteredUnits.length > 0 ? (
        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <StaggerItem key={unit.id}>
              <div className={`rounded-2xl border p-4 transition-shadow hover:shadow-md ${statusStyles[unit.status]}`}>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{unit.number}</span>
                  {unit.status === 'MAINTENANCE' ? (
                    <Wrench className="w-4 h-4" />
                  ) : unit.status === 'OCCUPIED' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Home className="w-4 h-4" />
                  )}
                </div>
                <p className="mt-1 text-xs font-medium capitalize opacity-80">{unit.status.toLowerCase()}</p>
                <p className="mt-3 text-xs opacity-70">{unit.building} · Floor {unit.floor}</p>
                {unit.resident && <p className="mt-1 text-xs font-semibold truncate">{unit.resident}</p>}
                <p className="mt-2 text-xs font-semibold">KES {unit.rentAmount.toLocaleString()}/mo</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">No units match these filters.</p>
        </div>
      )}
    </div>
  );
}
