import { createClient } from '@/lib/supabase/client';

export interface TechnicianContext {
  id: string;
  bio: string | null;
  experienceYears: number;
  verificationStatus: string;
  averageRating: number;
  isAvailable: boolean;
  hourlyRate: number | null;
  serviceArea: string | null;
  certifications: string[];
  categories: string[];
  jobsCompleted: number;
}

interface TechnicianRow {
  id: string;
  bio: string | null;
  experience_years: number;
  verification_status: string;
  average_rating: number;
  is_available: boolean;
  hourly_rate: number | null;
  service_area: string | null;
  certifications: string[];
  technician_categories: { category: { name: string } }[];
}

export async function getMyTechnicianContext(userId: string): Promise<TechnicianContext> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('technicians')
    .select(
      `id, bio, experience_years, verification_status, average_rating, is_available,
       hourly_rate, service_area, certifications,
       technician_categories(category:categories(name))`
    )
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  const row = data as unknown as TechnicianRow;

  const { count } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('technician_id', row.id)
    .eq('status', 'completed');

  return {
    id: row.id,
    bio: row.bio,
    experienceYears: row.experience_years,
    verificationStatus: row.verification_status,
    averageRating: Number(row.average_rating),
    isAvailable: row.is_available,
    hourlyRate: row.hourly_rate,
    serviceArea: row.service_area,
    certifications: row.certifications,
    categories: row.technician_categories.map((tc) => tc.category.name),
    jobsCompleted: count ?? 0,
  };
}

export async function updateAvailability(technicianId: string, isAvailable: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from('technicians')
    .update({ is_available: isAvailable })
    .eq('id', technicianId);

  if (error) throw error;
}
