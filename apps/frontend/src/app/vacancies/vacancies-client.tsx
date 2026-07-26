"use client";
import React from 'react';
import { VacancyCard } from '../../components/vacancies/vacancy-card';

const mockVacancies = [
  { id: '1', title: 'Luxury Apartment in Westlands', rentAmount: 45000, bedrooms: 2, bathrooms: 2 },
  { id: '2', title: 'Studio Flat - Kilimani', rentAmount: 25000, bedrooms: 1, bathrooms: 1 },
];

export default function VacanciesClient() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Houses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVacancies.map(vacancy => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}
      </div>
    </div>
  );
}
