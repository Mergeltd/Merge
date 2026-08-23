"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandlordContext } from '@/hooks/use-landlord-context';
import { useCreateVacancy } from '@/hooks/use-vacancies';
import { toUserMessage } from '@/lib/errors';

const neighborhoods = ['Westlands', 'Kilimani', 'Kileleshwa', 'Lavington'];
const bedroomOptions = [1, 2, 3, 4, 5];
const bathroomOptions = [1, 2, 3, 4];

interface CreateListingModalProps {
  open: boolean;
  onClose: () => void;
  landlordId: string | undefined;
}

// Previously faked success after a setTimeout and discarded the form
// data entirely — the "created" listing never actually appeared in the
// list shown on this page (docs/migration/plan.md Phase 9 / the audit's
// Landlord Dashboard finding). Now a real insert, which is why it shows
// up in the vacancies list immediately via query invalidation.
export function CreateListingModal({ open, onClose, landlordId }: CreateListingModalProps) {
  const { data: landlordCtx } = useLandlordContext(landlordId);
  const createVacancy = useCreateVacancy(landlordCtx?.landlordId);

  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('Kilimani');
  const [rentAmount, setRentAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (typeof document === 'undefined') return null;

  const reset = () => {
    setTitle('');
    setNeighborhood('Kilimani');
    setRentAmount('');
    setDepositAmount('');
    setBedrooms(2);
    setBathrooms(1);
    setDescription('');
    setSubmitted(false);
    setError(null);
    createVacancy.reset();
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landlordCtx) {
      setError('Could not identify your landlord account — please try again.');
      return;
    }
    setError(null);
    createVacancy.mutate(
      {
        landlordId: landlordCtx.landlordId,
        title,
        description,
        neighborhood,
        rentAmount: Number(rentAmount),
        depositAmount: Number(depositAmount),
        bedrooms,
        bathrooms,
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err) => setError(toUserMessage(err)),
      }
    );
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
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Listing saved as draft</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                  &quot;{title || 'Your new listing'}&quot; is ready to review. Publish it from the Vacancies tab whenever you&apos;re ready.
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
                <h2 className="text-lg font-bold text-slate-900">List a New Vacancy</h2>
                <p className="mt-1 text-sm text-slate-500">Publish a unit to the MERGE marketplace and start receiving applications.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-xs font-medium text-slate-700">Listing Title</label>
                    <input
                      id="title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Bright 2-Bedroom Apartment"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">Neighborhood</label>
                    <div className="flex flex-wrap gap-2">
                      {neighborhoods.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setNeighborhood(n)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                            neighborhood === n
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="rent" className="text-xs font-medium text-slate-700">Monthly Rent (KES)</label>
                      <input
                        id="rent"
                        type="number"
                        required
                        min={0}
                        value={rentAmount}
                        onChange={(e) => setRentAmount(e.target.value)}
                        placeholder="45000"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="deposit" className="text-xs font-medium text-slate-700">Deposit (KES)</label>
                      <input
                        id="deposit"
                        type="number"
                        required
                        min={0}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="90000"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700">Bedrooms</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {bedroomOptions.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setBedrooms(n)}
                            className={cn(
                              'py-2 rounded-md text-xs font-semibold border transition-colors',
                              bedrooms === n
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700">Bathrooms</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {bathroomOptions.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setBathrooms(n)}
                            className={cn(
                              'py-2 rounded-md text-xs font-semibold border transition-colors',
                              bathrooms === n
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-xs font-medium text-slate-700">Description</label>
                    <textarea
                      id="description"
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the unit, amenities, and what makes it stand out..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 resize-none"
                    />
                  </div>

                  {error && <p className="text-xs text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={createVacancy.isPending}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all disabled:opacity-70"
                  >
                    {createVacancy.isPending ? 'Saving…' : 'Save as Draft'}
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
