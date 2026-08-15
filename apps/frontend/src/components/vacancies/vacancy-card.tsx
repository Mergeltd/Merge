"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bed, Bath, MapPin, ArrowUpRight, Ruler, CalendarClock, ShieldCheck } from 'lucide-react';

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  rentAmount: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  propertyType: string;
  neighborhood?: string;
  availability: string;
  amenities: string[];
  image: string;
  verifiedLandlord?: boolean;
}

export const VacancyCard = ({ vacancy }: { vacancy: Vacancy }) => {
  const visibleAmenities = vacancy.amenities.slice(0, 3);
  const extraAmenities = vacancy.amenities.length - visibleAmenities.length;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/70 hover:border-indigo-100 transition-shadow duration-300"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={vacancy.image}
          alt={vacancy.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/5 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {vacancy.neighborhood && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" />
              {vacancy.neighborhood}
            </span>
          )}
          <span className="inline-flex items-center text-xs font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {vacancy.propertyType}
          </span>
        </div>
        {vacancy.verifiedLandlord && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-lg font-bold drop-shadow-sm">
            KES {vacancy.rentAmount.toLocaleString()}
            <span className="text-xs font-medium text-white/80"> / mo</span>
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-white/90">
            <CalendarClock className="w-3.5 h-3.5" />
            {vacancy.availability}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg text-slate-900">{vacancy.title}</h3>
        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">{vacancy.description}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-sm text-slate-600">
          <span className="flex items-center"><Bed className="w-4 h-4 mr-1 text-indigo-500" /> {vacancy.bedrooms} Bed</span>
          <span className="flex items-center"><Bath className="w-4 h-4 mr-1 text-indigo-500" /> {vacancy.bathrooms} Bath</span>
          <span className="flex items-center"><Ruler className="w-4 h-4 mr-1 text-indigo-500" /> {vacancy.areaSqft.toLocaleString()} sqft</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {visibleAmenities.map((amenity) => (
            <span
              key={amenity}
              className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {extraAmenities > 0 && (
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              +{extraAmenities} more
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Deposit: <span className="font-semibold text-slate-700">KES {vacancy.depositAmount.toLocaleString()}</span></span>
        </div>

        <button className="group/btn w-full mt-5 py-2 bg-slate-900 text-white rounded-md font-medium text-sm hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5">
          Apply Now
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </motion.div>
  );
};
