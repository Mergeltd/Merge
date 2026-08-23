import { useQuery } from '@tanstack/react-query';
import { getAdminOverviewStats, getAdminFinanceSummary, getMonthlyRevenue, getRecentActivity } from '@/queries/admin-stats';

export function useAdminOverviewStats() {
  return useQuery({ queryKey: ['admin-overview-stats'], queryFn: getAdminOverviewStats });
}

export function useAdminFinanceSummary() {
  return useQuery({ queryKey: ['admin-finance-summary'], queryFn: getAdminFinanceSummary });
}

export function useMonthlyRevenue() {
  return useQuery({ queryKey: ['admin-monthly-revenue'], queryFn: getMonthlyRevenue });
}

export function useRecentActivity() {
  return useQuery({ queryKey: ['admin-recent-activity'], queryFn: getRecentActivity });
}
