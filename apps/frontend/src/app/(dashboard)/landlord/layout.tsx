"use client";

import { LayoutDashboard, Building2, FileText, Users, Wallet, Globe } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { landlordProfile } from '@/lib/mock/landlord';

const navItems: DashboardNavItem[] = [
  { href: '/landlord', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/landlord/vacancies', label: 'Vacancies', icon: Building2 },
  { href: '/landlord/applications', label: 'Applications', icon: FileText },
  { href: '/landlord/properties', label: 'Properties', icon: Users },
  { href: '/landlord/finance', label: 'Finance', icon: Wallet },
];

const footerLinks: DashboardNavItem[] = [{ href: '/vacancies', label: 'View Public Listings', icon: Globe }];

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel="Landlord"
      user={{
        name: `${landlordProfile.firstName} ${landlordProfile.lastName}`,
        subtitle: `Landlord · ${landlordProfile.email}`,
        initials: landlordProfile.initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
