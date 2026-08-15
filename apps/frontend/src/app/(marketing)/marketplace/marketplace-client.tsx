"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Star, Lock, ArrowRight } from 'lucide-react';
import { TechnicianCard } from '@/components/technician/technician-card';
import { Reveal } from '@/components/motion/reveal';
import { GradientBlobs } from '@/components/motion/gradient-blobs';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { SectionDivider } from '@/components/motion/section-divider';

const categories = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC'];

const mockTechs = [
  { id: '1', user: { firstName: 'John', lastName: 'Doe' }, bio: 'Expert plumber with 10 years of residential and commercial experience.', averageRating: 4.8, experienceYears: 10, category: 'Plumbing' },
  { id: '2', user: { firstName: 'Jane', lastName: 'Smith' }, bio: 'Master electrician specializing in rewiring and smart-home installs.', averageRating: 4.9, experienceYears: 7, category: 'Electrical' },
  { id: '3', user: { firstName: 'Peter', lastName: 'Otieno' }, bio: 'Custom carpentry, furniture repair, and built-in cabinetry.', averageRating: 4.7, experienceYears: 9, category: 'Carpentry' },
  { id: '4', user: { firstName: 'Grace', lastName: 'Wanjiru' }, bio: 'Interior and exterior painting with a focus on clean, fast finishes.', averageRating: 4.9, experienceYears: 6, category: 'Painting' },
  { id: '5', user: { firstName: 'Samuel', lastName: 'Kiptoo' }, bio: 'HVAC installation, servicing, and emergency repairs.', averageRating: 4.6, experienceYears: 8, category: 'HVAC' },
  { id: '6', user: { firstName: 'Mary', lastName: 'Achieng' }, bio: 'Licensed electrician focused on fault-finding and safety inspections.', averageRating: 5.0, experienceYears: 12, category: 'Electrical' },
];

const trustBadges = [
  { icon: ShieldCheck, label: 'ID-Verified & Background-Checked' },
  { icon: Star, label: 'Rated by Real Job Outcomes' },
  { icon: Lock, label: 'Secure Escrow Payments' },
];

export default function MarketplaceClient() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTechs = useMemo(
    () =>
      activeCategory === 'All'
        ? mockTechs
        : mockTechs.filter((tech) => tech.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <GradientBlobs />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <span className="inline-flex text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-400/30 px-3 py-1 rounded-full mb-6">
              The Technician Marketplace
            </span>
          </Reveal>
          <AnimatedHeading
            text="Find Trusted Technicians"
            gradientWords={['Trusted']}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
          />
          <Reveal delay={0.25}>
            <p className="mt-5 text-lg text-slate-300">
              Browse verified, background-checked professionals ready to take on your next job.
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
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? 'text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="category-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-indigo-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {category}
              </button>
            );
          })}
        </div>

        {filteredTechs.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTechs.map((tech) => (
                <motion.div
                  key={tech.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TechnicianCard tech={tech} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className="text-center text-slate-500">No technicians found in this category yet.</p>
        )}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-indigo-600">
        <div
          aria-hidden
          className="absolute inset-0 bg-[length:200%_200%] animate-gradient-x bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-600"
        />
        <Reveal className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Are you a technician?</h2>
          <p className="mt-4 text-indigo-100">
            Join the MERGE marketplace, get matched to jobs near you, and get paid instantly.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-50 hover:scale-[1.03] transition-all"
          >
            Join as a Technician
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
