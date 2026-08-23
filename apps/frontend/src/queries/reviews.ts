import { createClient } from '@/lib/supabase/client';

export interface TechReview {
  id: string;
  resident: string;
  unit: string;
  rating: number;
  qualityRating: number;
  speedRating: number;
  professionalismRating: number;
  comment: string | null;
  date: string;
}

interface ReviewRow {
  id: string;
  rating: number;
  quality_rating: number;
  speed_rating: number;
  professionalism_rating: number;
  comment: string | null;
  created_at: string;
  author: { first_name: string; last_name: string } | null;
  booking: {
    request: { unit: { number: string; building: { name: string } | null } | null } | null;
  } | null;
}

export async function getTechnicianReviews(technicianId: string): Promise<TechReview[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `id, rating, quality_rating, speed_rating, professionalism_rating, comment, created_at,
       author:profiles(first_name, last_name),
       booking:bookings(request:maintenance_requests(unit:units(number, building:buildings(name))))`
    )
    .eq('target_technician_id', technicianId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as unknown as ReviewRow[]).map((row) => {
    const unit = row.booking?.request?.unit;
    return {
      id: row.id,
      resident: row.author ? `${row.author.first_name} ${row.author.last_name}` : 'Resident',
      unit: unit ? `${unit.number}${unit.building ? `, ${unit.building.name}` : ''}` : '',
      rating: row.rating,
      qualityRating: row.quality_rating,
      speedRating: row.speed_rating,
      professionalismRating: row.professionalism_rating,
      comment: row.comment,
      date: new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
    };
  });
}
