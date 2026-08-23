import { describe, expect, it } from 'vitest';
import { createClient } from '@/lib/supabase/client';

describe('smoke: createClient works under vitest/jsdom', () => {
  it('constructs a client and can make an unauthenticated request', async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('id, name').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
