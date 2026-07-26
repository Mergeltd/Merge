import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ClipboardList,
  Search,
  MessageSquareText,
  CreditCard,
  FileCheck2,
  Inbox,
  Handshake,
  Wallet,
} from 'lucide-react';
import { FaqAccordion } from '@/components/marketing/faq-accordion';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'See how MERGE matches residents with verified technicians, and how technicians get discovered, hired, and paid.',
  alternates: {
    canonical: '/how-it-works',
  },
};

const residentSteps = [
  {
    icon: ClipboardList,
    title: 'Submit a Request',
    description: 'Describe the issue, attach photos, and choose a preferred time window.',
  },
  {
    icon: Search,
    title: 'Get Matched',
    description: 'We match you with nearby, verified technicians qualified for the job.',
  },
  {
    icon: MessageSquareText,
    title: 'Track & Communicate',
    description: 'Message your technician directly and follow live job status updates.',
  },
  {
    icon: CreditCard,
    title: 'Pay Securely',
    description: 'Approve the completed work and pay through your MERGE wallet — no cash needed.',
  },
];

const technicianSteps = [
  {
    icon: FileCheck2,
    title: 'Apply & Get Verified',
    description: 'Submit your national ID, business registration, and certifications for review.',
  },
  {
    icon: Inbox,
    title: 'Receive Job Invites',
    description: 'Get matched to jobs near you based on your skills and availability.',
  },
  {
    icon: Handshake,
    title: 'Collaborate When Needed',
    description: 'Bring in other specialists on multi-disciplinary jobs with pre-agreed revenue splits.',
  },
  {
    icon: Wallet,
    title: 'Get Paid Instantly',
    description: 'Funds release from escrow straight to your wallet once the job is confirmed complete.',
  },
];

const faqs = [
  {
    question: 'How are technicians verified?',
    answer:
      'Every technician submits a national ID, business registration, and relevant certifications. A platform admin reviews and approves each profile before it becomes visible in search results.',
  },
  {
    question: 'How does payment and escrow work?',
    answer:
      'Residents pay into a secure wallet when a job is confirmed. Funds are held in escrow and released to the technician once the resident confirms the work is complete, integrated with M-Pesa and Stripe.',
  },
  {
    question: 'Can multiple technicians work on one job?',
    answer:
      'Yes. If a job needs multiple disciplines, a technician can invite specialists into the job with a pre-negotiated, contract-enforced revenue split that MERGE automates.',
  },
  {
    question: 'What if I manage an entire building, not just one unit?',
    answer:
      'Property managers get a dedicated building dashboard covering resident directories, community notices, and every maintenance request across the property in one place.',
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            How MERGE Works
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            A transparent, secure flow for residents who need work done and technicians who do it.
          </p>
        </div>
      </section>

      {/* For residents */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">For Residents</span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Get maintenance done, hassle-free</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {residentSteps.map(({ icon: Icon, title, description }, index) => (
            <div key={title}>
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

      {/* For technicians */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">For Technicians</span>
            <h2 className="mt-2 text-3xl font-bold text-white">Grow your business on MERGE</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicianSteps.map(({ icon: Icon, title, description }, index) => (
              <div key={title}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Frequently asked questions</h2>
        </div>
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to try it yourself?</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-50 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-md font-medium text-sm hover:bg-indigo-500/80 transition-colors"
            >
              Browse Technicians
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
