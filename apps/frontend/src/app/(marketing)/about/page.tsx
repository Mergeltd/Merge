import type { Metadata } from 'next';
import Image from 'next/image';
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
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { GradientBlobs } from '@/components/motion/gradient-blobs';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { SectionDivider } from '@/components/motion/section-divider';

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
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <GradientBlobs />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <span className="inline-flex text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-400/30 px-3 py-1 rounded-full mb-6">
              Our Story
            </span>
          </Reveal>
          <AnimatedHeading
            text="Solving property maintenance, from the ground up"
            gradientWords={['property', 'ground']}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight text-balance"
          />
          <Reveal delay={0.3}>
            <p className="mt-6 text-lg text-slate-300">
              MERGE exists to close the trust gap between the people who live in a building, the
              people who manage it, and the technicians who keep it running.
            </p>
          </Reveal>
        </div>
        <div className="absolute bottom-0 inset-x-0 translate-y-px">
          <SectionDivider className="fill-white" />
        </div>
      </section>

      {/* Story: problem vs approach */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">Why we built MERGE</h2>
            <p className="mt-4 text-slate-600">
              Property maintenance has always relied on group chats, guesswork, and cash. We think
              it deserves better infrastructure.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal direction="left">
            <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
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
          </Reveal>
          <Reveal direction="right">
            <div className="relative h-full overflow-hidden bg-indigo-600 rounded-2xl p-8">
              <div aria-hidden className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse-glow" />
              <h3 className="relative font-semibold text-white flex items-center gap-2">
                <Check className="w-5 h-5" />
                The MERGE approach
              </h3>
              <ul className="relative mt-5 space-y-4">
                {approach.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-indigo-50">
                    <CircleDot className="w-3.5 h-3.5 mt-1 text-indigo-300 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Image break */}
      <section className="relative">
        <Reveal className="relative h-64 sm:h-80 w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop"
            alt="Modern apartment community courtyard"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <p className="max-w-2xl mx-auto px-6 pb-8 text-center w-full text-white text-sm sm:text-base font-medium">
              Built for the buildings people actually live in — not a spreadsheet.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900">What we stand for</h2>
            </div>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <StaggerItem key={title}>
                <div className="group h-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Icon className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Roadmap / where we are today */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">Where we are today</h2>
            <p className="mt-4 text-slate-600">
              MERGE is being built in the open, in sequential phases. Here&apos;s where things
              stand right now.
            </p>
          </div>
        </Reveal>
        <StaggerGroup className="mt-12 space-y-4" stagger={0.08}>
          {roadmap.map(({ phase, title, status }) => (
            <StaggerItem key={phase}>
              <div
                className={`flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${
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
                  <span className="ml-auto text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                    In Progress
                  </span>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-indigo-600">
        <div
          aria-hidden
          className="absolute inset-0 bg-[length:200%_200%] animate-gradient-x bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-600"
        />
        <Reveal className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Want to build the future of property management with us?</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-50 hover:scale-[1.03] transition-all"
            >
              Create an Account
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-md font-medium text-sm hover:bg-indigo-500/80 hover:scale-[1.03] transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
