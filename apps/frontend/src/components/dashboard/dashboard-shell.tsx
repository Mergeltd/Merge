"use client";

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut, ChevronDown, Settings } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth.service';

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface DashboardUser {
  name: string;
  subtitle: string;
  initials: string;
}

interface DashboardShellProps {
  children: ReactNode;
  navItems: DashboardNavItem[];
  roleLabel: string;
  user: DashboardUser;
  footerLinks?: DashboardNavItem[];
}

function isActive(pathname: string, item: DashboardNavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarContent({
  navItems,
  footerLinks,
  roleLabel,
  pathname,
  onNavigate,
}: {
  navItems: DashboardNavItem[];
  footerLinks?: DashboardNavItem[];
  roleLabel: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <Logo />
      </div>
      <div className="px-6 pt-5 pb-2">
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
          {roleLabel}
        </span>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {active && (
                <motion.span
                  layoutId="dashboard-nav-active"
                  className="absolute inset-0 rounded-lg bg-indigo-50"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative w-4.5 h-4.5 shrink-0" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {footerLinks && footerLinks.length > 0 && (
        <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
          {footerLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardShell({ children, navItems, roleLabel, user, footerLinks }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const activeItem = navItems.find((item) => isActive(pathname, item));
  const rootSegment = navItems[0]?.href.split('/')[1];
  const profileHref = rootSegment ? `/${rootSegment}/profile` : '/profile';

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-white border-r border-slate-100 z-40">
        <SidebarContent navItems={navItems} footerLinks={footerLinks} roleLabel={roleLabel} pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 p-2 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent
                navItems={navItems}
                footerLinks={footerLinks}
                roleLabel={roleLabel}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden p-2 -ml-2 text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-sm font-semibold text-slate-900 flex-1 min-w-0 truncate">
            {activeItem?.label ?? roleLabel}
          </h1>

          <NotificationBell />

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {user.initials}
              </span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-semibold text-slate-800">{user.name}</span>
                <span className="block text-[11px] text-slate-400">{user.subtitle}</span>
              </span>
              <ChevronDown className={cn('hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform', menuOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.subtitle}</p>
                    </div>
                    <Link
                      href={profileHref}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
