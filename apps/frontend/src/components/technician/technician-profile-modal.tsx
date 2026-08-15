"use client";

import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Clock,
  Briefcase,
  Award,
  BadgeCheck,
  MessageSquareText,
  ArrowRight,
} from 'lucide-react';
import type { Technician } from './technician-card';

interface TechnicianProfileModalProps {
  tech: Technician;
  open: boolean;
  onClose: () => void;
}

export function TechnicianProfileModal({ tech, open, onClose }: TechnicianProfileModalProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / cover */}
            <div className="relative h-36 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-600 overflow-hidden">
              <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
            </div>

            <div className="px-6 sm:px-8 pb-8">
              <div className="flex items-end gap-4 -mt-12">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg shrink-0">
                  <Image src={tech.image} alt={`${tech.user.firstName} ${tech.user.lastName}`} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900">
                      {tech.user.firstName} {tech.user.lastName}
                    </h2>
                    {tech.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  {tech.category && (
                    <span className="inline-block mt-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {tech.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  {tech.averageRating.toFixed(1)}
                  <span className="font-normal text-slate-400">({tech.reviewCount} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {tech.location}
                </span>
                <span className={`flex items-center gap-1.5 font-medium ${tech.available ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tech.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  {tech.available ? 'Available Now' : 'Currently Booked'}
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-600 leading-relaxed">{tech.bio}</p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Briefcase, label: 'Experience', value: `${tech.experienceYears} yrs` },
                  { icon: Award, label: 'Jobs Done', value: `${tech.jobsCompleted}+` },
                  { icon: Clock, label: 'Response Time', value: tech.responseTime },
                  { icon: ShieldCheck, label: 'Call-Out Rate', value: `KES ${tech.hourlyRate.toLocaleString()}/hr` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <Icon className="w-4 h-4 text-indigo-500 mx-auto" />
                    <div className="mt-1.5 text-sm font-bold text-slate-900">{value}</div>
                    <div className="text-[11px] text-slate-500">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Specialties</h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {tech.skills.map((skill) => (
                    <span key={skill} className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Certifications &amp; Verification</h3>
                <ul className="mt-2.5 space-y-2">
                  {tech.certifications.map((cert) => (
                    <li key={cert} className="flex items-center gap-2 text-sm text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all"
                >
                  Request {tech.user.firstName}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-md font-medium text-sm hover:bg-slate-200 transition-colors"
                >
                  <MessageSquareText className="w-4 h-4" />
                  Message
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
