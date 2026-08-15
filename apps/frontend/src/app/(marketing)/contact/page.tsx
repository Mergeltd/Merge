import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Clock, MapPin, LifeBuoy } from 'lucide-react';
import { ContactForm } from '@/components/marketing/contact-form';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { GradientBlobs } from '@/components/motion/gradient-blobs';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { SectionDivider } from '@/components/motion/section-divider';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the MERGE team — questions about the platform, partnerships, or support.',
  alternates: {
    canonical: '/contact',
  },
};

const infoCards = [
  {
    icon: Mail,
    title: 'Email',
    description: 'hello@merge.app',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We aim to reply within 1 business day.',
  },
  {
    icon: MapPin,
    title: 'Market',
    description: 'Currently focused on Nairobi, Kenya.',
  },
  {
    icon: LifeBuoy,
    title: 'Support',
    description: 'Existing users: use in-app chat for the fastest response.',
  },
];

export default function ContactPage() {
  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <GradientBlobs />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <span className="inline-flex text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-400/30 px-3 py-1 rounded-full mb-6">
              We&apos;d Love to Hear From You
            </span>
          </Reveal>
          <AnimatedHeading
            text="Get in Touch"
            gradientWords={['Touch']}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
          />
          <Reveal delay={0.25}>
            <p className="mt-6 text-lg text-slate-300">
              Questions about MERGE, a partnership idea, or feedback on the platform? We&apos;d love
              to hear from you.
            </p>
          </Reveal>
        </div>
        <div className="absolute bottom-0 inset-x-0 translate-y-px">
          <SectionDivider className="fill-white" />
        </div>
      </section>

      {/* Info cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoCards.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <div className="group h-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Icon className="text-white w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Form */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-2xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>
              <p className="mt-1 text-sm text-slate-500">Fill out the form and our team will get back to you.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Other ways to reach us / CTA */}
      <Reveal className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Looking for answers first?</h2>
        <p className="mt-3 text-slate-600">
          Check our frequently asked questions before reaching out — you might find what you need
          right away.
        </p>
        <Link
          href="/how-it-works"
          className="mt-6 inline-flex px-6 py-3 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:scale-[1.03] transition-all"
        >
          View FAQ
        </Link>
      </Reveal>
    </main>
  );
}
