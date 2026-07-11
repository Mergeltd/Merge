"use client";
import React from 'react';
import { TechnicianCard } from '../../components/technician/technician-card';

const mockTechs = [
  { id: '1', user: { firstName: 'John', lastName: 'Doe' }, bio: 'Expert plumber with 10 years exp.', averageRating: 4.8, experienceYears: 10 },
  { id: '2', user: { firstName: 'Jane', lastName: 'Smith' }, bio: 'Master electrician.', averageRating: 4.9, experienceYears: 7 },
];

export default function MarketplacePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Technician Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTechs.map(tech => (
          <TechnicianCard key={tech.id} tech={tech} />
        ))}
      </div>
    </div>
  );
}
