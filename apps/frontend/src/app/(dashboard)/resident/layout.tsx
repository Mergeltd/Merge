"use client";

import { LayoutDashboard, Wrench, Wallet, Bot, Users, Store } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/providers/auth-provider';
import { useProfile } from '@/hooks/use-profile';
import { useResidentContext } from '@/hooks/use-resident-context';
import { getInitials } from '@/lib/utils';

const navItems: DashboardNavItem[] = [
  { href: '/resident', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/resident/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/resident/wallet', label: 'Wallet', icon: Wallet },
  { href: '/resident/ai', label: 'AI Assistant', icon: Bot },
  { href: '/resident/community', label: 'Community', icon: Users },
];

const footerLinks: DashboardNavItem[] = [{ href: '/marketplace', label: 'Browse Marketplace', icon: Store }];

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);
  const { data: residentCtx } = useResidentContext(session?.user.id);

  // Closes the TODO left in docs/migration/plan.md Phase 6 — the
  // unit/apartment join is wired now that Phase 7 built it.
  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : '…';
  const initials = profile ? getInitials(profile.first_name, profile.last_name) : '';
  const subtitle = residentCtx
    ? `${residentCtx.unit_number ? `Unit ${residentCtx.unit_number}` : 'No unit assigned'} · ${residentCtx.apartment_name}`
    : '…';

  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel="Resident"
      user={{
        name: displayName,
        subtitle,
        initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
