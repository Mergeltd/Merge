import { createClient } from '@/lib/supabase/client';

export interface ResidentContext {
  id: string;
  apartment_id: string;
  unit_id: string | null;
  apartment_name: string;
  unit_number: string | null;
}

// The join every other resident-dashboard query builds on: residents.id
// (not profiles.id) is the foreign key on maintenance_requests/wallets,
// and apartment/unit names are what the dashboard shell's subtitle needs
// (docs/migration/plan.md Phase 6 left this join for Phase 7).
export async function getMyResidentContext(userId: string): Promise<ResidentContext> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('residents')
    .select('id, apartment_id, unit_id, apartment:apartments(name), unit:units(number)')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  const apartment = data.apartment as unknown as { name: string } | null;
  const unit = data.unit as unknown as { number: string } | null;

  return {
    id: data.id,
    apartment_id: data.apartment_id,
    unit_id: data.unit_id,
    apartment_name: apartment?.name ?? 'Unknown Apartment',
    unit_number: unit?.number ?? null,
  };
}

export interface AdminResident {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  unit: string;
  building: string;
  email: string;
  phone: string | null;
  leaseStart: string | null;
  leaseEnd: string | null;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
}

interface AdminResidentRow {
  id: string;
  lease_start: string | null;
  lease_end: string | null;
  user: { first_name: string; last_name: string; email: string; phone_number: string | null; status: string } | null;
  unit: { number: string; building: { name: string } | null } | null;
}

// Admin-wide, same reasoning as queries/units.ts's getAllUnits — relies
// on residents_select_self_or_manager's manages_apartment() branch, which
// now includes apartment_admin/super_admin after this phase's RLS fix.
export async function getAllResidents(): Promise<AdminResident[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('residents')
    .select(
      `id, lease_start, lease_end,
       user:profiles(first_name, last_name, email, phone_number, status),
       unit:units(number, building:buildings(name))`
    )
    .is('deleted_at', null);

  if (error) throw error;

  return (data as unknown as AdminResidentRow[]).map((row) => ({
    id: row.id,
    name: row.user ? `${row.user.first_name} ${row.user.last_name}` : 'Resident',
    firstName: row.user?.first_name ?? 'Resident',
    lastName: row.user?.last_name ?? '',
    unit: row.unit?.number ?? '—',
    building: row.unit?.building?.name ?? '—',
    email: row.user?.email ?? '',
    phone: row.user?.phone_number ?? null,
    leaseStart: row.lease_start ? new Date(row.lease_start).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : null,
    leaseEnd: row.lease_end ? new Date(row.lease_end).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : null,
    status: (row.user?.status ?? 'active').toUpperCase() as AdminResident['status'],
  }));
}
