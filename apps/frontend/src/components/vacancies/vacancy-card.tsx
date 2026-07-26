"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Bed, Bath, DollarSign, MapPin } from 'lucide-react';

interface Vacancy { id: string; title: string; rentAmount: number; bedrooms: number; bathrooms: number; neighborhood?: string; }

export const VacancyCard = ({ vacancy }: { vacancy: Vacancy }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
  >
    <div className="p-6">
      {vacancy.neighborhood && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2">
          <MapPin className="w-3 h-3" />
          {vacancy.neighborhood}
        </span>
      )}
      <h3 className="font-bold text-lg text-slate-900">{vacancy.title}</h3>
      <div className="flex gap-4 mt-3 text-sm text-slate-600">
        <span className="flex items-center"><Bed className="w-4 h-4 mr-1" /> {vacancy.bedrooms} Bed</span>
        <span className="flex items-center"><Bath className="w-4 h-4 mr-1" /> {vacancy.bathrooms} Bath</span>
      </div>
      <div className="mt-4 text-xl font-bold text-indigo-600 flex items-center">
        <DollarSign className="w-5 h-5" /> {vacancy.rentAmount.toLocaleString()} / mo
      </div>
      <button className="w-full mt-6 py-2 bg-slate-900 text-white rounded-md font-medium text-sm hover:bg-slate-800">
        Apply Now
      </button>
    </div>
  </motion.div>
);
