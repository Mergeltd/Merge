"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Award } from 'lucide-react';

interface Technician {
  id: string;
  user: { firstName: string; lastName: string };
  bio: string;
  averageRating: number;
  experienceYears: number;
  category?: string;
}

export const TechnicianCard = ({ tech }: { tech: Technician }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        {tech.category && (
          <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2">
            {tech.category}
          </span>
        )}
        <h3 className="font-bold text-lg">{tech.user.firstName} {tech.user.lastName}</h3>
        <p className="text-sm text-slate-500 mt-1">{tech.bio}</p>
      </div>
      <div className="flex items-center text-amber-500 font-semibold shrink-0">
        <Star className="w-4 h-4 fill-current mr-1" />
        {tech.averageRating.toFixed(1)}
      </div>
    </div>
    <div className="mt-4 flex items-center space-x-4 text-sm text-slate-600">
      <div className="flex items-center">
        <Award className="w-4 h-4 mr-1 text-indigo-500" />
        {tech.experienceYears} yrs exp
      </div>
    </div>
    <button className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700">
      View Profile
    </button>
  </motion.div>
);
