"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Camera, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RequestUrgency } from '@/components/dashboard/status-badge';

const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC', 'Other'];

const urgencyOptions: { value: RequestUrgency; label: string; className: string }[] = [
  { value: 'LOW', label: 'Low', className: 'data-[active=true]:bg-slate-800 data-[active=true]:text-white' },
  { value: 'MEDIUM', label: 'Medium', className: 'data-[active=true]:bg-sky-600 data-[active=true]:text-white' },
  { value: 'HIGH', label: 'High', className: 'data-[active=true]:bg-orange-500 data-[active=true]:text-white' },
  { value: 'CRITICAL', label: 'Critical', className: 'data-[active=true]:bg-red-600 data-[active=true]:text-white' },
];

interface NewRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewRequestModal({ open, onClose }: NewRequestModalProps) {
  const [category, setCategory] = useState('Plumbing');
  const [urgency, setUrgency] = useState<RequestUrgency>('MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (typeof document === 'undefined') return null;

  const reset = () => {
    setCategory('Plumbing');
    setUrgency('MEDIUM');
    setTitle('');
    setDescription('');
    setSubmitted(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            aria-hidden
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
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
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Request submitted</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                  We&apos;re matching you with a nearby verified {category.toLowerCase()} technician. You&apos;ll get a
                  notification the moment someone accepts.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
                >
                  Done
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-900">Report a Maintenance Issue</h2>
                <p className="mt-1 text-sm text-slate-500">Describe the problem and we&apos;ll match you with a verified technician.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCategory(c)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                            category === c
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="title" className="text-xs font-medium text-slate-700">Issue Title</label>
                    <input
                      id="title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Kitchen sink pipe leaking"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-xs font-medium text-slate-700">Description</label>
                    <textarea
                      id="description"
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us more — when it started, what you've tried, anything the technician should know..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">Urgency</label>
                    <div className="grid grid-cols-4 gap-2">
                      {urgencyOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          data-active={urgency === opt.value}
                          onClick={() => setUrgency(opt.value)}
                          className={cn(
                            'py-2 rounded-md text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200 transition-colors',
                            opt.className
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-200 rounded-md text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Attach Photos (optional)
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all disabled:opacity-70"
                  >
                    {submitting ? 'Submitting…' : 'Submit Request'}
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
