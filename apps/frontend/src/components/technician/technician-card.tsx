"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Award, ShieldCheck } from 'lucide-react';
import { TechnicianProfileModal } from './technician-profile-modal';

export interface Technician {
  id: string;
  user: { firstName: string; lastName: string };
  bio: string;
  averageRating: number;
  reviewCount: number;
  experienceYears: number;
  category?: string;
  image: string;
  location: string;
  jobsCompleted: number;
  responseTime: string;
  hourlyRate: number;
  skills: string[];
  certifications: string[];
  verified: boolean;
  available: boolean;
}

export const TechnicianCard = ({ tech }: { tech: Technician }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/70 hover:border-indigo-100 transition-shadow duration-300 overflow-hidden"
      >
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={tech.image}
            alt={`${tech.user.firstName} ${tech.user.lastName}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/5 to-transparent" />
          {tech.category && (
            <span className="absolute top-3 left-3 inline-block text-xs font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {tech.category}
            </span>
          )}
          {tech.verified && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <h3 className="font-bold text-white text-lg drop-shadow-sm">
              {tech.user.firstName} {tech.user.lastName}
            </h3>
            <div className="flex items-center text-amber-400 font-semibold shrink-0 text-sm drop-shadow-sm">
              <Star className="w-4 h-4 fill-current mr-1" />
              {tech.averageRating.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{tech.bio}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1 text-indigo-500" />
              {tech.experienceYears} yrs exp
            </div>
            <div className="text-slate-400">·</div>
            <div>{tech.jobsCompleted}+ jobs</div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tech.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
          >
            View Profile
          </button>
        </div>
      </motion.div>

      <TechnicianProfileModal tech={tech} open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};
