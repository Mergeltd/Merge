"use client";

import { LayoutDashboard, Building2, FileText, Users, Wallet, Globe } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/providers/auth-provider';
import { useProfile } from '@/hooks/use-profile';
import { getInitials } from '@/lib/utils';

const navItems: DashboardNavItem[] = [
  { href: '/landlord', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/landlord/vacancies', label: 'Vacancies', icon: Building2 },
  { href: '/landlord/applications', label: 'Applications', icon: FileText },
  { href: '/landlord/properties', label: 'Properties', icon: Users },
  { href: '/landlord/finance', label: 'Finance', icon: Wallet },
];

const footerLinks: DashboardNavItem[] = [{ href: '/vacancies', label: 'View Public Listings', icon: Globe }];

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);

  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : '…';
  const initials = profile ? getInitials(profile.first_name, profile.last_name) : '';
  const email = profile?.email ?? '';

  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel="Landlord"
      user={{
        name: displayName,
        subtitle: `Landlord · ${email}`,
        initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
