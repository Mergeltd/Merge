"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, ShieldCheck } from 'lucide-react';

interface Technician {
  id: string;
  user: { firstName: string; lastName: string };
  bio: string;
  averageRating: number;
  experienceYears: number;
  category?: string;
}

const gradients = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-pink-500',
  'from-rose-500 to-red-500',
];

function gradientFor(id: string) {
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
  return gradients[idx];
}

export const TechnicianCard = ({ tech }: { tech: Technician }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    className="group relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/70 hover:border-indigo-100 transition-shadow duration-300 overflow-hidden"
  >
    <div
      aria-hidden
      className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-indigo-50 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300"
    />
    <div className="relative flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${gradientFor(tech.id)} flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-105 transition-transform`}
        >
          {tech.user.firstName[0]}
          {tech.user.lastName[0]}
        </div>
        <div className="min-w-0">
          {tech.category && (
            <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1.5">
              {tech.category}
            </span>
          )}
          <h3 className="font-bold text-slate-900 truncate">
            {tech.user.firstName} {tech.user.lastName}
          </h3>
        </div>
      </div>
      <div className="flex items-center text-amber-500 font-semibold shrink-0 text-sm">
        <Star className="w-4 h-4 fill-current mr-1" />
        {tech.averageRating.toFixed(1)}
      </div>
    </div>
    <p className="relative mt-3 text-sm text-slate-500 leading-relaxed">{tech.bio}</p>
    <div className="relative mt-4 flex items-center gap-4 text-sm text-slate-600">
      <div className="flex items-center">
        <Award className="w-4 h-4 mr-1 text-indigo-500" />
        {tech.experienceYears} yrs exp
      </div>
      <div className="flex items-center text-emerald-600">
        <ShieldCheck className="w-4 h-4 mr-1" />
        Verified
      </div>
    </div>
    <button className="relative w-full mt-6 py-2 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors">
      View Profile
    </button>
  </motion.div>
);
