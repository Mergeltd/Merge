"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import type { AdminMaintenanceRequest } from '@/queries/maintenance-requests';
import type { AdminTechnician } from '@/queries/technicians';

interface AssignTechnicianModalProps {
  request: AdminMaintenanceRequest | null;
  technicians: AdminTechnician[];
  onClose: () => void;
  onAssign: (requestId: string, technicianId: string, scheduledAt: string) => Promise<void>;
}

function defaultScheduledAt() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function AssignTechnicianModal({ request, technicians, onClose, onAssign }: AssignTechnicianModalProps) {
  const [selected, setSelected] = useState<AdminTechnician | null>(null);
  const [scheduledAt, setScheduledAt] = useState(defaultScheduledAt);
  const [assigning, setAssigning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (typeof document === 'undefined') return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelected(null);
      setScheduledAt(defaultScheduledAt());
      setAssigning(false);
      setDone(false);
      setError(null);
    }, 300);
  };

  const handleAssign = async () => {
    if (!selected || !request) return;
    setAssigning(true);
    setError(null);
    try {
      await onAssign(request.id, selected.id, new Date(scheduledAt).toISOString());
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const eligible = technicians.filter((t) => t.verificationStatus === 'VERIFIED' && t.category === request?.category);

  return createPortal(
    <AnimatePresence>
      {request && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div aria-hidden onClick={handleClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                  className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </motion.div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Technician assigned</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {selected?.name} has been proposed for this job and will need to accept it.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-900">Assign Technician</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {request.title} — Unit {request.unit}, {request.building}
                </p>

                {error && (
                  <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <div className="mt-5 space-y-2">
                  {eligible.map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => setSelected(tech)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors',
                        selected?.id === tech.id ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'
                      )}
                    >
                      <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {getInitials(tech.firstName, tech.lastName)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{tech.name}</p>
                        <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {tech.averageRating.toFixed(1)} · {tech.jobsCompleted} jobs
                        </p>
                      </div>
                    </button>
                  ))}
                  {eligible.length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-500">
                      No verified {request.category.toLowerCase()} technicians available right now.
                    </p>
                  )}
                </div>

                {eligible.length > 0 && (
                  <label className="mt-4 block">
                    <span className="text-xs font-medium text-slate-600">Scheduled for</span>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </label>
                )}

                <button
                  type="button"
                  disabled={!selected || assigning}
                  onClick={handleAssign}
                  className="mt-6 w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all disabled:opacity-50"
                >
                  {assigning ? 'Assigning…' : 'Assign Technician'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
