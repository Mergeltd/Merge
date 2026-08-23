"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, CalendarCheck, FileCheck2, ArrowRight, Loader2 } from 'lucide-react';
import { VacancyCard } from '@/components/vacancies/vacancy-card';
import { ApplyModal } from '@/components/vacancies/apply-modal';
import { Reveal } from '@/components/motion/reveal';
import { GradientBlobs } from '@/components/motion/gradient-blobs';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { SectionDivider } from '@/components/motion/section-divider';
import { useAuth } from '@/providers/auth-provider';
import { usePublishedVacancies } from '@/hooks/use-vacancies';
import type { PublicVacancy } from '@/queries/vacancies';

const trustBadges = [
  { icon: ShieldCheck, label: 'Verified Landlords' },
  { icon: CalendarCheck, label: 'Flexible Viewing Scheduling' },
  { icon: FileCheck2, label: 'Digital Applications' },
];

export default function VacanciesClient() {
  const router = useRouter();
  const { session } = useAuth();
  const { data: vacancies = [], isLoading } = usePublishedVacancies();
  const [activeNeighborhood, setActiveNeighborhood] = useState('All');
  const [applyingTo, setApplyingTo] = useState<PublicVacancy | null>(null);

  const neighborhoods = useMemo(
    () => ['All', ...Array.from(new Set(vacancies.map((v) => v.neighborhood).filter(Boolean)))],
    [vacancies]
  );

  const filteredVacancies = useMemo(
    () =>
      activeNeighborhood === 'All'
        ? vacancies
        : vacancies.filter((vacancy) => vacancy.neighborhood === activeNeighborhood),
    [vacancies, activeNeighborhood]
  );

  const handleApply = (vacancy: PublicVacancy) => {
    // login-client.tsx always redirects to the account's dashboard on
    // success, not back to where the user came from — no redirect param
    // to pass here until that exists.
    if (!session) {
      router.push('/login');
      return;
    }
    setApplyingTo(vacancy);
  };

  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <GradientBlobs />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <span className="inline-flex text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-400/30 px-3 py-1 rounded-full mb-6">
              The Rental Marketplace
            </span>
          </Reveal>
          <AnimatedHeading
            text="Find Your Next Home"
            gradientWords={['Next', 'Home']}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
          />
          <Reveal delay={0.25}>
            <p className="mt-5 text-lg text-slate-300">
              Browse available rental units, schedule viewings, and apply — all in one place.
            </p>
          </Reveal>
        </div>
        <div className="absolute bottom-0 inset-x-0 translate-y-px">
          <SectionDivider className="fill-white" />
        </div>
      </section>

      {/* Trust badges */}
      <Reveal className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
              <Icon className="w-4 h-4 text-indigo-600" />
              {label}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Filters + grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {neighborhoods.map((neighborhood) => {
            const active = activeNeighborhood === neighborhood;
            return (
              <button
                key={neighborhood}
                type="button"
                onClick={() => setActiveNeighborhood(neighborhood)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? 'text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="neighborhood-active-pill"
                    className="absolute inset-0 rounded-full bg-indigo-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{neighborhood}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : filteredVacancies.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVacancies.map((vacancy) => (
                <motion.div
                  key={vacancy.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <VacancyCard vacancy={vacancy} onApply={() => handleApply(vacancy)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className="text-center text-slate-500">No listings found in this neighborhood yet.</p>
        )}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-indigo-600">
        <div
          aria-hidden
          className="absolute inset-0 bg-[length:200%_200%] animate-gradient-x bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-600"
        />
        <Reveal className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Are you a landlord?</h2>
          <p className="mt-4 text-indigo-100">
            List your property on MERGE and manage viewings and applications digitally.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-50 hover:scale-[1.03] transition-all"
          >
            List Your Property
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      {session && (
        <ApplyModal vacancy={applyingTo} applicantId={session.user.id} onClose={() => setApplyingTo(null)} />
      )}
    </main>
  );
}
