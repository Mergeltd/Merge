import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Scale,
  Rocket,
  X,
  Check,
  CircleDot,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn why MERGE exists: a secure, AI-powered platform bridging residents, property managers, landlords, and verified local technicians.',
  alternates: {
    canonical: '/about',
  },
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Trust & Safety First',
    description:
      'Every technician is identity-verified and every payment moves through escrow. Trust is designed in, not bolted on.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'Buildings are more than addresses — they’re communities. We build tools that bring residents and managers closer together.',
  },
  {
    icon: Scale,
    title: 'Fair & Transparent',
    description:
      'Clear pricing, contract-enforced revenue splits, and transparent ratings — for technicians and residents alike.',
  },
  {
    icon: Rocket,
    title: 'Built for Scale',
    description:
      'A clean, modular architecture designed to support one building or ten thousand without compromise.',
  },
];

const problems = [
  'Maintenance requests get lost in group chats and paper logs.',
  'Residents can’t tell if a technician is actually qualified or vetted.',
  'Cash payments leave no record and no recourse when something goes wrong.',
  'Landlords manage vacancies and applications across scattered spreadsheets and calls.',
];

const approach = [
  'One dashboard per building, with every request tracked from open to resolved.',
  'Technicians upload ID, business registration, and certifications for admin review before going live.',
  'Payments move through secure wallets and escrow — money only moves when the job is done.',
  'Landlords list, screen, and manage applications in a single, structured workflow.',
];

const roadmap = [
  { phase: 'Phase 0', title: 'Project Planning & Architecture', status: 'current' as const },
  { phase: 'Phase 1', title: 'Authentication, Authorization & RBAC', status: 'upcoming' as const },
  { phase: 'Phase 2', title: 'Apartment & Community Profile Management', status: 'upcoming' as const },
  { phase: 'Phase 3', title: 'Technician Onboarding, Verification & Profiles', status: 'upcoming' as const },
  { phase: 'Phase 4', title: 'Smart Maintenance Requests & Job Lifecycle', status: 'upcoming' as const },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Solving property maintenance, from the ground up
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            MERGE exists to close the trust gap between the people who live in a building, the
            people who manage it, and the technicians who keep it running.
          </p>
        </div>
      </section>

      {/* Story: problem vs approach */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">Why we built MERGE</h2>
          <p className="mt-4 text-slate-600">
            Property maintenance has always relied on group chats, guesswork, and cash. We think
            it deserves better infrastructure.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              The problem today
            </h3>
            <ul className="mt-5 space-y-4">
              {problems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <CircleDot className="w-3.5 h-3.5 mt-1 text-slate-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-indigo-600 rounded-2xl p-8">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Check className="w-5 h-5" />
              The MERGE approach
            </h3>
            <ul className="mt-5 space-y-4">
              {approach.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-indigo-50">
                  <CircleDot className="w-3.5 h-3.5 mt-1 text-indigo-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">What we stand for</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-white w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap / where we are today */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">Where we are today</h2>
          <p className="mt-4 text-slate-600">
            MERGE is being built in the open, in sequential phases. Here&apos;s where things
            stand right now.
          </p>
        </div>
        <ol className="mt-12 space-y-4">
          {roadmap.map(({ phase, title, status }) => (
            <li
              key={phase}
              className={`flex items-center gap-4 rounded-xl border p-4 ${
                status === 'current'
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-slate-100 bg-white'
              }`}
            >
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  status === 'current' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {phase}
              </span>
              <span className={`text-sm font-medium ${status === 'current' ? 'text-indigo-900' : 'text-slate-600'}`}>
                {title}
              </span>
              {status === 'current' && (
                <span className="ml-auto text-xs font-semibold text-indigo-600">In Progress</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Want to build the future of property management with us?</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-50 transition-colors"
            >
              Create an Account
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-md font-medium text-sm hover:bg-indigo-500/80 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
