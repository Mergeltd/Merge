// Shared fixture provisioning for integration tests. Uses the Auth Admin
// API + service-role key (test-only — see .env.test.local) to create real
// users the same way a real signup would, then real table inserts for
// everything else. Never imported by app code, only by *.integration.test.ts.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY!;

function adminHeaders() {
  return { apikey: SECRET_KEY, Authorization: `Bearer ${SECRET_KEY}`, 'Content-Type': 'application/json' };
}

export async function createFixtureUser(id: string, email: string, role: string, firstName: string, lastName: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({
      id,
      email,
      password: 'TestPass123!',
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName, role },
    }),
  });
  if (!res.ok) throw new Error(`createFixtureUser(${email}) failed: ${res.status} ${await res.text()}`);
}

export async function deleteFixtureUser(id: string) {
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

export async function adminInsert(table: string, row: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...adminHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`adminInsert(${table}) failed: ${res.status} ${await res.text()}`);
}

export async function adminDelete(table: string, column: string, value: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
    method: 'DELETE',
    headers: { ...adminHeaders(), Prefer: 'return=minimal' },
  });
}

export async function adminSelectOne<T>(table: string, column: string, value: string, select: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}&select=${select}`, {
    headers: adminHeaders(),
  });
  const rows = await res.json();
  if (!res.ok || !rows[0]) throw new Error(`adminSelectOne(${table}) failed: ${res.status} ${JSON.stringify(rows)}`);
  return rows[0];
}

export { SUPABASE_URL, ANON_KEY };
