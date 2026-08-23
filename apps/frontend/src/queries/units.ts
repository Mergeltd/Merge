import { createClient } from '@/lib/supabase/client';

export interface BuildingSummary {
  id: string;
  name: string;
  units: number;
  occupied: number;
}

export type UnitStatus = 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';

export interface AdminUnit {
  id: string;
  number: string;
  building: string;
  floor: number;
  status: UnitStatus;
  rentAmount: number;
  resident?: string;
}

interface UnitRow {
  id: string;
  number: string;
  floor: number;
  status: string;
  rent_amount: number;
  building: { name: string } | null;
  residents: { user: { first_name: string; last_name: string } | null }[];
}

// Admin-wide (not scoped to one landlord/apartment) — apartment_admin and
// super_admin are both treated as full-platform admins throughout this
// schema's RLS (is_admin()), not per-apartment, so this intentionally
// doesn't filter by apartment the way queries/landlords.ts does.
export async function getAllUnits(): Promise<AdminUnit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('units')
    .select('id, number, floor, status, rent_amount, building:buildings(name), residents(user:profiles(first_name, last_name))')
    .is('deleted_at', null)
    .order('number')
    .range(0, 199); // docs/migration/plan.md Phase 19 pagination audit — first page; full pager UI is a known gap, not built yet

  if (error) throw error;

  return (data as unknown as UnitRow[]).map((row) => ({
    id: row.id,
    number: row.number,
    building: row.building?.name ?? '',
    floor: row.floor,
    status: row.status.toUpperCase() as UnitStatus,
    rentAmount: Number(row.rent_amount),
    resident: row.residents[0]?.user ? `${row.residents[0].user.first_name} ${row.residents[0].user.last_name}` : undefined,
  }));
}

export async function getAllBuildings(): Promise<BuildingSummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('buildings')
    .select('id, name, units(status)')
    .is('deleted_at', null)
    .order('name');

  if (error) throw error;

  return (data as unknown as { id: string; name: string; units: { status: string }[] }[]).map((row) => ({
    id: row.id,
    name: row.name,
    units: row.units.length,
    occupied: row.units.filter((u) => u.status === 'occupied').length,
  }));
}
