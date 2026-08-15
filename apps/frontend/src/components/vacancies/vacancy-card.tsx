"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Bed, Bath, MapPin, ArrowUpRight } from 'lucide-react';

interface Vacancy { id: string; title: string; rentAmount: number; bedrooms: number; bathrooms: number; neighborhood?: string; }

const gradients = [
  'from-indigo-500 via-violet-500 to-sky-400',
  'from-emerald-500 via-teal-500 to-cyan-400',
  'from-amber-500 via-orange-500 to-rose-400',
  'from-fuchsia-500 via-pink-500 to-rose-400',
];

function gradientFor(id: string) {
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
  return gradients[idx];
}

export const VacancyCard = ({ vacancy }: { vacancy: Vacancy }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/70 hover:border-indigo-100 transition-shadow duration-300"
  >
    <div className={`relative h-28 w-full bg-gradient-to-br ${gradientFor(vacancy.id)} overflow-hidden`}>
      <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
      <div
        aria-hidden
        className="absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500"
      />
      {vacancy.neighborhood && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <MapPin className="w-3 h-3" />
          {vacancy.neighborhood}
        </span>
      )}
    </div>
    <div className="p-6">
      <h3 className="font-bold text-lg text-slate-900">{vacancy.title}</h3>
      <div className="flex gap-4 mt-3 text-sm text-slate-600">
        <span className="flex items-center"><Bed className="w-4 h-4 mr-1" /> {vacancy.bedrooms} Bed</span>
        <span className="flex items-center"><Bath className="w-4 h-4 mr-1" /> {vacancy.bathrooms} Bath</span>
      </div>
      <div className="mt-4 text-xl font-bold text-indigo-600">
        KES {vacancy.rentAmount.toLocaleString()}
        <span className="text-sm font-medium text-slate-400"> / mo</span>
      </div>
      <button className="group/btn w-full mt-6 py-2 bg-slate-900 text-white rounded-md font-medium text-sm hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5">
        Apply Now
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      </button>
    </div>
  </motion.div>
);
