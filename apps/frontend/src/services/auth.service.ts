import { createClient } from '@/lib/supabase/client';
import type { LoginDto, RegisterUserDto } from '@merge/types';

// Replaces the old fetch-to-NestJS version (docs/migration/plan.md Phase 4)
// — that backend's auth guard never actually verified a token (see the
// Supabase migration audit's security findings), so nothing here is a
// straight port; it's Supabase Auth from scratch.
export const authService = {
  async register(dto: RegisterUserDto) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          first_name: dto.firstName,
          last_name: dto.lastName,
          // profiles.role is a lowercase Postgres enum (user_role); the
          // form/DTO uses uppercase values to match the existing Zod
          // schema (RESIDENT, TECHNICIAN, ...) — convert at this boundary
          // rather than changing either side's convention.
          role: dto.role.toLowerCase(),
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async login(dto: LoginDto) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });
    if (error) throw error;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    if (profileError) throw profileError;

    return { session: data.session, role: profile.role as string };
  },

  async logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
