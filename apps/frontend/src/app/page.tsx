import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Wrench, ShieldCheck, Users, Home as HomeIcon, Wallet, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MERGE | Property Management & Maintenance Marketplace',
  description:
    'MERGE connects residents, property managers, landlords, and verified local technicians in one AI-powered property management and maintenance marketplace.',
  alternates: {
    canonical: '/',
  },
};

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Property Ecosystem
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Connecting Homes, People &amp; Trusted Services
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          MERGE is an enterprise-grade property management and maintenance marketplace that
          bridges residents, property managers, landlords, and verified local technicians in one
          secure, on-demand ecosystem.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/marketplace"
            className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-md font-medium text-sm hover:border-indigo-300 transition-colors"
          >
            Browse Technicians
          </Link>
          <Link
            href="/vacancies"
            className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-md font-medium text-sm hover:border-indigo-300 transition-colors"
          >
            Browse Vacancies
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
            >
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <Icon className="text-white w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
