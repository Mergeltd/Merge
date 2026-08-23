import { createClient } from '@/lib/supabase/client';

export interface LandlordContext {
  landlordId: string;
}

// landlord_apartments references landlords.id, not profiles.id directly —
// this resolves that one extra hop. vacancies/wallets use profiles.id
// directly (see queries/vacancies.ts, queries/wallets.ts), so this is
// only needed for the property-portfolio join.
export async function getMyLandlordContext(userId: string): Promise<LandlordContext> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('landlords')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return { landlordId: data.id };
}

export interface OwnedProperty {
  id: string;
  name: string;
  neighborhood: string;
  units: number;
  occupied: number;
  monthlyRent: number;
}

interface ApartmentRow {
  apartment: {
    id: string;
    name: string;
    city: string;
    buildings: { units: { status: string; rent_amount: number }[] }[];
  };
}

export async function getMyProperties(landlordId: string): Promise<OwnedProperty[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('landlord_apartments')
    .select('apartment:apartments(id, name, city, buildings(units(status, rent_amount)))')
    .eq('landlord_id', landlordId);

  if (error) throw error;

  return (data as unknown as ApartmentRow[]).map(({ apartment }) => {
    const units = apartment.buildings.flatMap((b) => b.units);
    return {
      id: apartment.id,
      name: apartment.name,
      neighborhood: apartment.city,
      units: units.length,
      occupied: units.filter((u) => u.status === 'occupied').length,
      monthlyRent: units.reduce((sum, u) => sum + Number(u.rent_amount), 0),
    };
  });
}
