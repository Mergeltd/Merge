"use client";

import { LayoutDashboard, Wrench, Wallet, Bot, Users, Store } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { residentProfile } from '@/lib/mock/resident';

const navItems: DashboardNavItem[] = [
  { href: '/resident', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/resident/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/resident/wallet', label: 'Wallet', icon: Wallet },
  { href: '/resident/ai', label: 'AI Assistant', icon: Bot },
  { href: '/resident/community', label: 'Community', icon: Users },
];

const footerLinks: DashboardNavItem[] = [{ href: '/marketplace', label: 'Browse Marketplace', icon: Store }];

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel="Resident"
      user={{
        name: `${residentProfile.firstName} ${residentProfile.lastName}`,
        subtitle: `${residentProfile.unit} · ${residentProfile.building}`,
        initials: residentProfile.initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
