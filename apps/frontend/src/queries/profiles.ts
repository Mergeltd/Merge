import { createClient } from '@/lib/supabase/client';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url: string | null;
}

// The pattern every domain query in Phases 7-10 follows: a plain async
// function that talks to Supabase directly, wrapped by a hook (see
// hooks/use-profile.ts) rather than called straight from a component.
export async function getProfile(userId: string): Promise<Profile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, role, avatar_url')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}
