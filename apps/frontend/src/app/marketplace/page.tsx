import type { Metadata } from 'next';
import MarketplaceClient from './marketplace-client';

export const metadata: Metadata = {
  title: 'Technician Marketplace',
  description:
    'Browse verified, background-checked plumbers, electricians, carpenters, and other local technicians available for on-demand maintenance jobs on MERGE.',
  alternates: {
    canonical: '/marketplace',
  },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
