"use client";

import { LayoutDashboard, Wrench, Wallet, Bot, Users, Store } from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/dashboard/dashboard-shell';
import { residentProfile } from '@/lib/mock/resident';
import { useAuth } from '@/providers/auth-provider';
import { useProfile } from '@/hooks/use-profile';
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

  // Name/initials come from the real profiles table (proves the
  // hooks/queries pattern end-to-end, docs/migration/plan.md Phase 6).
  // Subtitle still needs the resident's unit/building, which requires a
  // join Phases 7-10 will wire per-dashboard — falls back to mock until
  // then rather than mixing partial real data with a misleading label.
  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : `${residentProfile.firstName} ${residentProfile.lastName}`;
  const initials = profile ? getInitials(profile.first_name, profile.last_name) : residentProfile.initials;

  return (
    <DashboardShell
      navItems={navItems}
      footerLinks={footerLinks}
      roleLabel="Resident"
      user={{
        name: displayName,
        subtitle: `${residentProfile.unit} · ${residentProfile.building}`,
        initials,
      }}
    >
      {children}
    </DashboardShell>
  );
}
