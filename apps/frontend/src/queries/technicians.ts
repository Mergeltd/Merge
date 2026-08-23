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

export interface AdminTechnician {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  category: string;
  verificationStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'REJECTED';
  averageRating: number;
  jobsCompleted: number;
  submittedAt: string;
}

interface AdminTechnicianRow {
  id: string;
  verification_status: string;
  average_rating: number;
  created_at: string;
  user: { first_name: string; last_name: string } | null;
  technician_categories: { category: { name: string } }[];
}

// Admin-wide roster + verification queue. jobsCompleted is fetched
// per-technician via a second pass rather than a nested count — PostgREST
// embedded counts need a separate aggregate call per relation, and this
// keeps the shape simple for a roster-sized list.
export async function getAllTechnicians(): Promise<AdminTechnician[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('technicians')
    .select(
      `id, verification_status, average_rating, created_at,
       user:profiles(first_name, last_name),
       technician_categories(category:categories(name))`
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = data as unknown as AdminTechnicianRow[];

  const { data: completedCounts } = await supabase
    .from('bookings')
    .select('technician_id')
    .eq('status', 'completed');
  const countByTech = new Map<string, number>();
  for (const b of completedCounts ?? []) {
    countByTech.set(b.technician_id, (countByTech.get(b.technician_id) ?? 0) + 1);
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.user ? `${row.user.first_name} ${row.user.last_name}` : 'Technician',
    firstName: row.user?.first_name ?? 'Technician',
    lastName: row.user?.last_name ?? '',
    category: row.technician_categories[0]?.category.name ?? 'General',
    verificationStatus: row.verification_status.toUpperCase() as AdminTechnician['verificationStatus'],
    averageRating: Number(row.average_rating),
    jobsCompleted: countByTech.get(row.id) ?? 0,
    submittedAt: new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
  }));
}

// technicians_admin_verify (Phase 3 RLS) restricts this write to
// is_super_admin() specifically, not just is_admin() — an apartment_admin's
// update would otherwise silently match zero rows under RLS rather than
// error. `.select().single()` forces that case to surface as a real
// PostgREST "no rows" error instead of a fake success.
export async function setTechnicianVerification(
  technicianId: string,
  status: 'verified' | 'suspended' | 'rejected'
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('technicians')
    .update({ verification_status: status })
    .eq('id', technicianId)
    .select()
    .single();

  if (error) throw error;
}
