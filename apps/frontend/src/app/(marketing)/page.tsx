import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Wrench,
  ShieldCheck,
  Users,
  Home as HomeIcon,
  Wallet,
  Sparkles,
  Lock,
  Zap,
  ClipboardList,
  Search,
  MessageSquareText,
  CreditCard,
  UserCheck,
  FileCheck2,
  Star,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'MERGE | Property Management & Maintenance Marketplace',
  description:
    'MERGE connects residents, property managers, landlords, and verified local technicians in one AI-powered property management and maintenance marketplace.',
  alternates: {
    canonical: '/',
  },
};

const trustStrip = [
  { icon: ShieldCheck, label: 'ID-Verified Technicians' },
  { icon: Lock, label: 'Secure Escrow Payments' },
  { icon: Zap, label: 'Real-Time Job Tracking' },
];

const audiences = [
  {
    icon: Users,
    title: 'Residents',
    description: 'Report an issue in seconds and get matched with a nearby verified technician.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
  },
  {
    icon: Wrench,
    title: 'Technicians',
    description: 'Grow your client base, collaborate with peers, and get paid instantly for every job.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
  },
  {
    icon: Building2,
    title: 'Property Managers',
    description: 'Run every building from one dashboard — notices, maintenance, and community boards.',
    image: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=800&auto=format&fit=crop',
  },
  {
    icon: HomeIcon,
    title: 'Landlords',
    description: 'List vacancies, screen applicants, and manage leases without the paperwork.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
  },
];

const pillars = [
  {
    icon: Building2,
    title: 'Digital Building Communities',
    description:
      'Every apartment building gets its own private digital environment with a dashboard, localized notices, and resident directories.',
  },
  {
    icon: Wrench,
    title: 'On-Demand Maintenance Marketplace',
    description:
      'A geolocated matching system pairs residents with nearby certified, background-checked technicians in minutes.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Verification',
    description:
      'Technicians are verified with national IDs, business registrations, and certifications before they can accept jobs.',
  },
  {
    icon: Users,
    title: 'Technician Collaboration',
    description:
      'Specialists can invite peers into a job with pre-negotiated, contract-enforced, system-automated revenue splits.',
  },
  {
    icon: HomeIcon,
    title: 'Vacancy & Rental Marketplace',
    description:
      'Landlords advertise units while prospective tenants schedule viewings and submit digital applications.',
  },
  {
    icon: Wallet,
    title: 'Unified Payments & Wallets',
    description:
      'Secure resident, technician, and building wallets integrated with M-Pesa and Stripe for instant billing and escrow.',
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: 'Submit a Request',
    description: 'Describe the issue, attach photos, and set your availability in under a minute.',
  },
  {
    icon: Search,
    title: 'Get Matched',
    description: 'Our system pairs you with nearby, verified technicians suited to the job.',
  },
  {
    icon: MessageSquareText,
    title: 'Track & Communicate',
    description: 'Chat in real time and follow the job status from accepted to completed.',
  },
  {
    icon: CreditCard,
    title: 'Pay Securely',
    description: 'Funds are held in escrow and released automatically once the job is confirmed done.',
  },
];

const safeguards = [
  {
    icon: UserCheck,
    title: 'Identity & Background Checks',
    description:
      'Every technician uploads a national ID, business registration, and relevant certifications for admin review before they can appear in search results.',
  },
  {
    icon: FileCheck2,
    title: 'Contract-Enforced Collaboration',
    description:
      'When a job needs multiple specialists, revenue splits are pre-negotiated and system-enforced — no disputes after the fact.',
  },
  {
    icon: Star,
    title: 'Ratings & Reviews',
    description:
      'Every completed job is rated, building a transparent reputation for technicians and accountability for the platform.',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
          alt="Modern residential property at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950"
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Property Ecosystem
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Connecting Homes, People &amp; Trusted Services
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
            MERGE is an enterprise-grade property management and maintenance marketplace that
            bridges residents, property managers, landlords, and verified local technicians in one
            secure, on-demand ecosystem.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-md font-medium text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Browse Technicians
            </Link>
            <Link
              href="/vacancies"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-md font-medium text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Browse Vacancies
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustStrip.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                <Icon className="w-4 h-4 text-indigo-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">Built for everyone in the property lifecycle</h2>
          <p className="mt-4 text-slate-600">
            Whether you live in a building, manage one, own one, or fix one — MERGE has a
            dedicated experience for you.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map(({ icon: Icon, title, description, image }) => (
            <div
              key={title}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-36 w-full overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Icon className="text-white w-5 h-5" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform pillars */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need, in one platform</h2>
            <p className="mt-4 text-slate-600">
              Seven strategic pillars power a seamless experience from move-in to maintenance to
              move-out.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
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

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">From request to resolved, in four steps</h2>
          <p className="mt-4 text-slate-600">A simple, transparent flow for every maintenance job.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & safety */}
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <Image
          src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1600&auto=format&fit=crop"
          alt="Two professionals shaking hands"
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white">Trust &amp; safety, built in</h2>
            <p className="mt-4 text-slate-400">
              Every interaction on MERGE is backed by verification, accountability, and secure
              payments.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {safeguards.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-white w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-indigo-600">
        <Image
          src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop"
          alt="Bright, modern home interior"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-indigo-700/90 to-indigo-600/80"
        />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-indigo-100">
            Join MERGE as a resident, technician, landlord, or property manager today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-50 transition-colors"
            >
              Create Your Account
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-md font-medium text-sm hover:bg-indigo-500/80 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
