"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Briefcase, Clock, MapPin, Banknote, BadgeCheck } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { technicianProfile } from '@/lib/mock/technician';

const stats = [
  { icon: Briefcase, label: 'Jobs Completed', value: technicianProfile.jobsCompleted.toLocaleString() },
  { icon: Star, label: 'Average Rating', value: `${technicianProfile.averageRating.toFixed(1)} / 5` },
  { icon: Clock, label: 'Experience', value: `${technicianProfile.experienceYears} years` },
  { icon: Banknote, label: 'Hourly Rate', value: `KES ${technicianProfile.hourlyRate.toLocaleString()}` },
];

export default function TechnicianProfilePage() {
  const [available, setAvailable] = useState(technicianProfile.isAvailable);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">This is what residents and admins see on the marketplace.</p>
      </div>

      <Reveal>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 ring-4 ring-white shadow-md">
              <Image src={technicianProfile.image} alt={technicianProfile.firstName} fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {technicianProfile.firstName} {technicianProfile.lastName}
                </h2>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{technicianProfile.category}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                {technicianProfile.location} · Member since {technicianProfile.memberSince}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAvailable((v) => !v)}
              className="flex items-center gap-3 shrink-0 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700">{available ? 'Available for jobs' : 'Not accepting jobs'}</span>
              <span
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${available ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <motion.span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                  animate={{ x: available ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                />
              </span>
            </button>
          </div>

          <p className="mt-5 text-sm text-slate-600 leading-relaxed">{technicianProfile.bio}</p>
        </div>
      </Reveal>

      <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <StaggerItem key={label}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <div className="mt-3 text-lg font-bold text-slate-900">{value}</div>
              <p className="mt-0.5 text-xs text-slate-500">{label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Reveal delay={0.1}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
            <h2 className="text-sm font-semibold text-slate-900">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {technicianProfile.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
            <h2 className="text-sm font-semibold text-slate-900">Certifications</h2>
            <div className="mt-3 space-y-2.5">
              {technicianProfile.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
