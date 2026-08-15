"use client";

import { useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminMaintenanceRequest, AdminTechnician } from '@/lib/mock/admin';

interface AssignTechnicianModalProps {
  request: AdminMaintenanceRequest | null;
  technicians: AdminTechnician[];
  onClose: () => void;
  onAssign: (requestId: string, technicianName: string) => void;
}

export function AssignTechnicianModal({ request, technicians, onClose, onAssign }: AssignTechnicianModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [done, setDone] = useState(false);

  if (typeof document === 'undefined') return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelected(null);
      setAssigning(false);
      setDone(false);
    }, 300);
  };

  const handleAssign = () => {
    if (!selected || !request) return;
    setAssigning(true);
    setTimeout(() => {
      onAssign(request.id, selected);
      setAssigning(false);
      setDone(true);
    }, 700);
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
                  {selected} has been notified and will pick up {request.id}.
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

                <div className="mt-5 space-y-2">
                  {eligible.map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => setSelected(tech.name)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors',
                        selected === tech.name ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'
                      )}
                    >
                      {tech.image && (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                          <Image src={tech.image} alt={tech.name} fill sizes="36px" className="object-cover" />
                        </div>
                      )}
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
