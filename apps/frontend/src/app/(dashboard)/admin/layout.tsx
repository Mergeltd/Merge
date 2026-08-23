"use client";

import { LayoutDashboard, Building2, Users, Wrench, ShieldCheck, Wallet, Globe } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/providers/auth-provider';
import { useProfile } from '@/hooks/use-profile';
import { getInitials } from '@/lib/utils';

const navItems: DashboardNavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/residents', label: 'Residents', icon: Users },
  { href: '/admin/technicians', label: 'Technicians', icon: ShieldCheck },
  { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/admin/finance', label: 'Finance', icon: Wallet },
];

const footerLinks: DashboardNavItem[] = [{ href: '/', label: 'View Public Site', icon: Globe }];

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  apartment_admin: 'Apartment Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);

  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : '…';
  const initials = profile ? getInitials(profile.first_name, profile.last_name) : '';
  const roleLabel = profile ? ROLE_LABELS[profile.role] ?? profile.role : 'Admin';

  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel={roleLabel}
      user={{
        name: displayName,
        subtitle: `${roleLabel} · ${profile?.email ?? ''}`,
        initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
