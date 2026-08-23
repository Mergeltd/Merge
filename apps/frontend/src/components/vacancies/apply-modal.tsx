"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { useSubmitApplication } from '@/hooks/use-applications';
import { toUserMessage } from '@/lib/errors';
import type { PublicVacancy } from '@/queries/vacancies';

interface ApplyModalProps {
  vacancy: PublicVacancy | null;
  applicantId: string;
  onClose: () => void;
}

export function ApplyModal({ vacancy, applicantId, onClose }: ApplyModalProps) {
  const submitApplication = useSubmitApplication();
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (typeof document === 'undefined') return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMonthlyIncome('');
      setEmployerName('');
      setNotes('');
      setSubmitted(false);
      setError(null);
      submitApplication.reset();
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacancy) return;
    setError(null);
    submitApplication.mutate(
      {
        vacancyId: vacancy.id,
        applicantId,
        monthlyIncome: Number(monthlyIncome),
        employerName: employerName || undefined,
        applicantNotes: notes || undefined,
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err) => setError(toUserMessage(err)),
      }
    );
  };

  return createPortal(
    <AnimatePresence>
      {vacancy && (
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

            {submitted ? (
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
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Application submitted</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                  The landlord for {vacancy.title} has been notified and will review your application.
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
                <h2 className="text-lg font-bold text-slate-900">Apply for {vacancy.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  KES {vacancy.rentAmount.toLocaleString()}/mo · {vacancy.neighborhood}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="monthlyIncome" className="text-xs font-medium text-slate-700">Monthly Income (KES)</label>
                    <input
                      id="monthlyIncome"
                      type="number"
                      required
                      min={0}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="e.g. 150000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="employerName" className="text-xs font-medium text-slate-700">Employer (optional)</label>
                    <input
                      id="employerName"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      placeholder="e.g. Acme Ltd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-xs font-medium text-slate-700">Anything the landlord should know? (optional)</label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 resize-none"
                    />
                  </div>

                  {error && <p className="text-xs text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitApplication.isPending}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all disabled:opacity-70"
                  >
                    {submitApplication.isPending ? 'Submitting…' : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
