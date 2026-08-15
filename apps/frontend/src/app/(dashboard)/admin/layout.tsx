"use client";

import { LayoutDashboard, Building2, Users, Wrench, ShieldCheck, Wallet, Globe } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { adminProfile } from '@/lib/mock/admin';

const navItems: DashboardNavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/residents', label: 'Residents', icon: Users },
  { href: '/admin/technicians', label: 'Technicians', icon: ShieldCheck },
  { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/admin/finance', label: 'Finance', icon: Wallet },
];

const footerLinks: DashboardNavItem[] = [{ href: '/', label: 'View Public Site', icon: Globe }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel="Apartment Admin"
      user={{
        name: `${adminProfile.firstName} ${adminProfile.lastName}`,
        subtitle: `${adminProfile.role} · ${adminProfile.apartment}`,
        initials: adminProfile.initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
