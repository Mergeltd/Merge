"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Smartphone, CreditCard, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const presetAmounts = [1000, 2500, 5000, 10000];

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function TopUpModal({ open, onClose }: TopUpModalProps) {
  const [amount, setAmount] = useState<number>(2500);
  const [method, setMethod] = useState<'MPESA' | 'STRIPE' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (typeof document === 'undefined') return null;

  const reset = () => {
    setAmount(2500);
    setMethod(null);
    setSubmitting(false);
    setSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleConfirm = () => {
    if (!method) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
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
          <motion.div aria-hidden onClick={handleClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
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
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  KES {amount.toLocaleString()} added
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {method === 'MPESA' ? 'Confirm the M-Pesa STK push on your phone to finish.' : 'Your card payment was processed successfully.'}
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
                <h2 className="text-lg font-bold text-slate-900">Top Up Wallet</h2>
                <p className="mt-1 text-sm text-slate-500">Add funds to pay for maintenance jobs instantly.</p>

                <div className="mt-6 space-y-2">
                  <label className="text-xs font-medium text-slate-700">Amount (KES)</label>
                  <input
                    type="number"
                    min={100}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-lg font-semibold outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                          amount === preset
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                        )}
                      >
                        {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-xs font-medium text-slate-700">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod('MPESA')}
                      className={cn(
                        'flex flex-col items-center justify-center gap-2 p-4 border rounded-xl transition-colors',
                        method === 'MPESA' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <Smartphone className={cn('w-6 h-6', method === 'MPESA' ? 'text-emerald-600' : 'text-slate-400')} />
                      <span className="text-sm font-semibold text-slate-800">M-Pesa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('STRIPE')}
                      className={cn(
                        'flex flex-col items-center justify-center gap-2 p-4 border rounded-xl transition-colors',
                        method === 'STRIPE' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <CreditCard className={cn('w-6 h-6', method === 'STRIPE' ? 'text-indigo-600' : 'text-slate-400')} />
                      <span className="text-sm font-semibold text-slate-800">Card</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!method || submitting}
                  className="w-full mt-6 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing…' : `Add KES ${amount.toLocaleString()}`}
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
