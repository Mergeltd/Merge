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
  Bot,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { GradientBlobs } from '@/components/motion/gradient-blobs';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { AnimatedHeading } from '@/components/motion/animated-heading';
import { SectionDivider } from '@/components/motion/section-divider';
import { ParallaxImage } from '@/components/motion/parallax-image';
import { Marquee } from '@/components/motion/marquee';

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

const heroStats = [
  { value: 6, suffix: '', label: 'Platform pillars' },
  { value: 4, suffix: '', label: 'Steps from request to resolved' },
  { value: 2, suffix: '', label: 'Payment rails — M-Pesa & Stripe' },
  { value: 24, suffix: '/7', label: 'AI assistant availability' },
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

const marqueeItems = [
  'AI-Powered Matching',
  'Escrow-Backed Payments',
  'Verified Technicians',
  'Realtime Job Tracking',
  'M-Pesa & Stripe',
  'Multi-Wallet Ledger',
  'Building Dashboards',
  'Rental Marketplace',
];

export default function HomePage() {
  return (
    <main className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
          alt="Modern residential property at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div aria-hidden className="absolute inset-0 bg-grid" />
        <GradientBlobs />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/80 to-slate-950"
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-indigo-400/30 shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" />
              AI-Powered Property Ecosystem
            </div>
          </Reveal>

          <AnimatedHeading
            text="Connecting Homes, People & Trusted Services"
            gradientWords={['Homes,', 'People', 'Trusted', 'Services']}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance"
          />

          <Reveal delay={0.35}>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              MERGE is an enterprise-grade property management and maintenance marketplace that
              bridges residents, property managers, landlords, and verified local technicians in one
              secure, on-demand ecosystem.
            </p>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-6 py-3 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/marketplace"
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-md font-medium text-sm hover:bg-white/20 hover:scale-[1.03] transition-all backdrop-blur-sm"
              >
                Browse Technicians
              </Link>
              <Link
                href="/vacancies"
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-md font-medium text-sm hover:bg-white/20 hover:scale-[1.03] transition-all backdrop-blur-sm"
              >
                Browse Vacancies
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.55}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustStrip.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  {label}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.65}>
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {heroStats.map((stat) => (
                <div key={stat.label} className="glass-dark rounded-2xl px-4 py-5">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Marquee strip */}
        <div className="relative border-t border-white/10 bg-black/20 py-4">
          <Marquee>
            {marqueeItems.map((item) => (
              <span key={item} className="flex items-center gap-3 text-sm font-medium text-slate-400 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {item}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Who it's for */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">Built for everyone in the property lifecycle</h2>
            <p className="mt-4 text-slate-600">
              Whether you live in a building, manage one, own one, or fix one — MERGE has a
              dedicated experience for you.
            </p>
          </div>
        </Reveal>
        <StaggerGroup className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map(({ icon: Icon, title, description, image }) => (
            <StaggerItem key={title}>
              <div className="group h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/30 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                    <Icon className="text-white w-5 h-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Platform pillars */}
      <section className="relative bg-slate-50 pt-20 pb-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-60" />
        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900">Everything you need, in one platform</h2>
              <p className="mt-4 text-slate-600">
                Six strategic pillars power a seamless experience from move-in to maintenance to
                move-out.
              </p>
            </div>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, description }) => (
              <StaggerItem key={title}>
                <div className="group h-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
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
        <div className="absolute bottom-0 inset-x-0 translate-y-px">
          <SectionDivider className="fill-white" />
        </div>
      </section>

      {/* How it works */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">From request to resolved, in four steps</h2>
            <p className="mt-4 text-slate-600">A simple, transparent flow for every maintenance job.</p>
          </div>
        </Reveal>
        <div className="relative mt-14">
          <div aria-hidden className="hidden lg:block absolute top-5 left-[12%] right-[12%] h-px overflow-hidden">
            <Reveal direction="left" duration={1.1} className="h-full">
              <div className="h-full w-full bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200" />
            </Reveal>
          </div>
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <StaggerItem key={title}>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-600/30 ring-4 ring-white">
                      {index + 1}
                    </div>
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Trust & safety */}
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <ParallaxImage
          src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1600&auto=format&fit=crop"
          alt="Two professionals shaking hands"
          className="absolute inset-0"
          imgClassName="opacity-15"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900" />
        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white">Trust &amp; safety, built in</h2>
              <p className="mt-4 text-slate-400">
                Every interaction on MERGE is backed by verification, accountability, and secure
                payments.
              </p>
            </div>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {safeguards.map(({ icon: Icon, title, description }) => (
              <StaggerItem key={title}>
                <div className="group h-full bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300">
                  <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
        <div className="absolute bottom-0 inset-x-0 translate-y-px">
          <SectionDivider className="fill-white" />
        </div>
      </section>

      {/* AI callout */}
      <section className="relative bg-white py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="relative rounded-3xl bg-slate-950 px-8 py-14 sm:px-14 overflow-hidden">
              <div aria-hidden className="absolute inset-0 bg-grid" />
              <GradientBlobs className="opacity-70" />
              <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-white/10">
                    <Bot className="w-3.5 h-3.5" />
                    MERGE AI Assistant
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-xl">
                    Describe the problem. Let AI triage, price, and route it to the right technician.
                  </h2>
                  <p className="mt-4 text-slate-400 max-w-xl">
                    Natural-language issue reporting, image-based diagnosis, and predictive
                    maintenance alerts — built directly into the resident and property manager
                    experience.
                  </p>
                </div>
                <Link
                  href="/ai"
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-md font-medium text-sm hover:bg-slate-100 hover:scale-[1.03] transition-all"
                >
                  Try the AI Assistant
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-indigo-600">
        <div
          aria-hidden
          className="absolute inset-0 bg-[length:200%_200%] animate-gradient-x bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-600"
        />
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
        <Reveal className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-indigo-100">
            Join MERGE as a resident, technician, landlord, or property manager today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-50 hover:scale-[1.03] transition-all"
            >
              Create Your Account
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-md font-medium text-sm hover:bg-indigo-500/80 hover:scale-[1.03] transition-all"
            >
              See How It Works
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
