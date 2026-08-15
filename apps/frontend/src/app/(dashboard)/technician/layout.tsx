"use client";

import { LayoutDashboard, ListChecks, CalendarCheck, Wallet, Star, UserCog, Globe } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { technicianProfile } from '@/lib/mock/technician';

const navItems: DashboardNavItem[] = [
  { href: '/technician', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/technician/jobs', label: 'Job Board', icon: ListChecks },
  { href: '/technician/bookings', label: 'My Bookings', icon: CalendarCheck },
  { href: '/technician/earnings', label: 'Earnings', icon: Wallet },
  { href: '/technician/reviews', label: 'Reviews', icon: Star },
  { href: '/technician/profile', label: 'Profile', icon: UserCog },
];

const footerLinks: DashboardNavItem[] = [{ href: '/marketplace', label: 'View Public Listing', icon: Globe }];

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel="Technician"
      user={{
        name: `${technicianProfile.firstName} ${technicianProfile.lastName}`,
        subtitle: `${technicianProfile.category} · ${technicianProfile.location}`,
        initials: technicianProfile.initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
