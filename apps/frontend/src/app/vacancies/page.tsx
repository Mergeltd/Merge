import type { Metadata } from 'next';
import VacanciesClient from './vacancies-client';

export const metadata: Metadata = {
  title: 'Rental Vacancies',
  description:
    'Browse available rental units, schedule viewings, and submit digital applications for apartments and houses listed on MERGE.',
  alternates: {
    canonical: '/vacancies',
  },
};

export default function VacancyMarketplacePage() {
  return <VacanciesClient />;
}
