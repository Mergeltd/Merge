import { createClient } from '@/lib/supabase/client';

export interface AdminOverviewStats {
  occupancyRate: number;
  activeResidents: number;
  openRequests: number;
  pendingVerifications: number;
  totalUnits: number;
  totalBuildings: number;
}

// One roundtrip per count rather than fetching full rows — these are
// dashboard tiles, not lists, and PostgREST's `count: 'exact', head: true`
// gets the number without shipping any rows.
export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const supabase = createClient();

  const [
    { count: totalUnits },
    { count: occupiedUnits },
    { count: totalBuildings },
    { count: openRequests },
    { count: pendingVerifications },
  ] = await Promise.all([
    supabase.from('units').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('units').select('id', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'occupied'),
    supabase.from('buildings').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase
      .from('maintenance_requests')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .in('status', ['open', 'assigned', 'in_progress']),
    supabase.from('technicians').select('id', { count: 'exact', head: true }).is('deleted_at', null).eq('verification_status', 'pending_verification'),
  ]);

  return {
    occupancyRate: totalUnits ? Math.round(((occupiedUnits ?? 0) / totalUnits) * 100) : 0,
    activeResidents: occupiedUnits ?? 0,
    openRequests: openRequests ?? 0,
    pendingVerifications: pendingVerifications ?? 0,
    totalUnits: totalUnits ?? 0,
    totalBuildings: totalBuildings ?? 0,
  };
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

// get_monthly_revenue() (Phase 10 migration) is the only sanctioned read of
// mv_monthly_revenue — the matview itself has RLS-equivalent access fully
// revoked since Postgres doesn't support RLS on materialized views.
// "Revenue" here is platform commission (commission_fee transactions),
// which is what the matview actually aggregates — not gross rent collected.
export async function getMonthlyRevenue(): Promise<MonthlyRevenuePoint[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_monthly_revenue');
  if (error) throw error;

  return (data as { month: string; transaction_count: number; total_revenue: number }[]).map((row) => ({
    month: new Date(row.month).toLocaleDateString(undefined, { month: 'short' }),
    revenue: Number(row.total_revenue),
  }));
}

export interface AdminFinanceSummary {
  monthlyRevenue: number;
  escrowHeld: number;
  pendingPayouts: number;
}

export async function getAdminFinanceSummary(): Promise<AdminFinanceSummary> {
  const supabase = createClient();

  const [monthly, escrowResult, bookingsResult, txResult] = await Promise.all([
    getMonthlyRevenue(),
    supabase.from('transactions').select('amount').eq('type', 'maintenance_escrow').eq('status', 'pending'),
    supabase.from('bookings').select('id, total_amount').eq('status', 'completed'),
    supabase.from('transactions').select('booking_id').not('booking_id', 'is', null),
  ]);

  if (escrowResult.error) throw escrowResult.error;
  if (bookingsResult.error) throw bookingsResult.error;
  if (txResult.error) throw txResult.error;

  const escrowHeld = (escrowResult.data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);

  const creditedBookingIds = new Set((txResult.data ?? []).map((t) => t.booking_id));
  const pendingPayouts = (bookingsResult.data ?? [])
    .filter((b) => !creditedBookingIds.has(b.id))
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  const monthlyRevenue = monthly.length ? monthly[monthly.length - 1].revenue : 0;

  return { monthlyRevenue, escrowHeld, pendingPayouts };
}

export interface AdminActivityEntry {
  id: string;
  message: string;
  timestamp: string;
}

// audit_logs (Phase 3) has no writers yet — nothing populates it until
// Phase 11's business-logic triggers land, so this legitimately returns an
// empty list today. Rendering that as an honest empty state rather than
// fabricating placeholder entries.
export async function getRecentActivity(): Promise<AdminActivityEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, action, entity_name, created_at, actor:profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .range(0, 3);

  if (error) throw error;

  return (data as unknown as { id: string; action: string; entity_name: string; created_at: string; actor: { first_name: string; last_name: string } | null }[]).map(
    (row) => ({
      id: row.id,
      message: `${row.actor ? `${row.actor.first_name} ${row.actor.last_name}` : 'System'} ${row.action} ${row.entity_name}`,
      timestamp: new Date(row.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    })
  );
}
