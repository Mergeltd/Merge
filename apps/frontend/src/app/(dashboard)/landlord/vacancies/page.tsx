"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Eye, Users, Building2, Rocket, Archive } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { CreateListingModal } from '@/components/vacancies/create-listing-modal';
import { vacancyListings as initialListings, type LandlordVacancy, type VacancyListingStatus } from '@/lib/mock/landlord';

const filters: { label: string; value: VacancyListingStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Under Contract', value: 'UNDER_CONTRACT' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
];

const statusStyles: Record<VacancyListingStatus, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700',
  UNDER_CONTRACT: 'bg-sky-50 text-sky-700',
  DRAFT: 'bg-slate-100 text-slate-600',
  ARCHIVED: 'bg-red-50 text-red-600',
};

export default function LandlordVacanciesPage() {
  const [listings, setListings] = useState<LandlordVacancy[]>(initialListings);
  const [activeFilter, setActiveFilter] = useState<VacancyListingStatus | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredListings = useMemo(
    () => (activeFilter === 'ALL' ? listings : listings.filter((l) => l.status === activeFilter)),
    [listings, activeFilter]
  );

  const publish = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'PUBLISHED', publishedAt: l.publishedAt ?? new Date().toISOString().slice(0, 10) } : l))
    );
  };

  const archive = (id: string) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'ARCHIVED' } : l)));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vacancies</h1>
          <p className="mt-1 text-sm text-slate-500">Manage every listing across your portfolio.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Listing
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = activeFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                active ? 'text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="landlord-vacancy-filter-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>

      {filteredListings.length > 0 ? (
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <StaggerItem key={listing.id}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-40 w-full">
                  <Image src={listing.image} alt={listing.title} fill sizes="360px" className="object-cover" />
                  <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[listing.status]}`}>
                    {listing.status === 'UNDER_CONTRACT' ? 'Under Contract' : listing.status.charAt(0) + listing.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold text-slate-900">{listing.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{listing.neighborhood} · {listing.bedrooms} bed · {listing.bathrooms} bath</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">KES {listing.rentAmount.toLocaleString()}/mo</p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {listing.views} views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {listing.applicantCount} applicants
                    </span>
                  </div>

                  <div className="mt-auto pt-4">
                    {listing.status === 'DRAFT' && (
                      <button
                        type="button"
                        onClick={() => publish(listing.id)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        Publish Listing
                      </button>
                    )}
                    {listing.status === 'PUBLISHED' && (
                      <button
                        type="button"
                        onClick={() => archive(listing.id)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">No listings match this filter.</p>
        </div>
      )}

      <CreateListingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
