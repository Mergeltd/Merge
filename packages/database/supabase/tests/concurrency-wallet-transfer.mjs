// docs/migration/plan.md Phase 18 — financial acceptance test: "no
// negative balances under concurrency". This can't be a pgTAP test —
// pgTAP runs one statement at a time on one connection, and the whole
// point here is genuinely simultaneous connections racing the same row,
// which is what actually exercises transfer_wallet_funds's `for update`
// lock. Run with real Node (18+) via:
//
//   SUPABASE_URL=... SUPABASE_ANON_KEY=... SUPABASE_SECRET_KEY=... node packages/database/supabase/tests/concurrency-wallet-transfer.mjs
//
// (the three env vars already live in packages/database/.env for this
// project). Creates its own fixture, fires 20 concurrent transfers of
// 100 each against a wallet funded with exactly 1000 (so exactly 10 can
// legally succeed), verifies the count and the final balance, then
// deletes everything it created — safe to run against the live project.

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SECRET_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY (or SUPABASE_PUBLISHABLE_KEY) / SUPABASE_SECRET_KEY in the environment.');
  process.exit(1);
}

const N = 20;
const AMOUNT = 100;
const STARTING_BALANCE = 1000;
const EXPECTED_SUCCESSES = STARTING_BALANCE / AMOUNT;

const ids = {
  apartment: '77777777-0000-4000-8000-000000000001',
  building: '77777777-0000-4000-8000-000000000002',
  unit: '77777777-0000-4000-8000-000000000003',
  residentUser: '77777777-0000-4000-8000-0000000000a1',
  resident: '77777777-0000-4000-8000-0000000000a2',
  landlordUser: '77777777-0000-4000-8000-0000000000b1',
  landlord: '77777777-0000-4000-8000-0000000000b2',
};

function adminFetch(path, body) {
  return fetch(`${SUPABASE_URL}${path}`, {
    method: 'POST',
    headers: { apikey: SECRET_KEY, Authorization: `Bearer ${SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function setupFixture() {
  // service-role key bypasses RLS, so table inserts go straight through
  // PostgREST rather than needing raw SQL access.
  const headers = { apikey: SECRET_KEY, Authorization: `Bearer ${SECRET_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
  const post = (path, body) => fetch(`${SUPABASE_URL}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });

  const signup = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'p18-concurrency.resident@merge.test',
      password: 'TestPass123!',
      email_confirm: true,
      user_metadata: { first_name: 'P18', last_name: 'Resident', role: 'resident' },
      id: ids.residentUser,
    }),
  });
  if (!signup.ok) throw new Error(`resident signup failed: ${signup.status} ${await signup.text()}`);

  const signup2 = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'p18-concurrency.landlord@merge.test',
      password: 'TestPass123!',
      email_confirm: true,
      user_metadata: { first_name: 'P18', last_name: 'Landlord', role: 'landlord' },
      id: ids.landlordUser,
    }),
  });
  if (!signup2.ok) throw new Error(`landlord signup failed: ${signup2.status} ${await signup2.text()}`);

  await post('/rest/v1/apartments', { id: ids.apartment, name: 'P18 Concurrency Test', address: '1 Test Rd', city: 'Nairobi' });
  await post('/rest/v1/buildings', { id: ids.building, name: 'P18 Block', apartment_id: ids.apartment });
  await post('/rest/v1/units', { id: ids.unit, number: 'P18-1', floor: 1, status: 'occupied', rent_amount: 40000, building_id: ids.building });
  await post('/rest/v1/residents', { id: ids.resident, user_id: ids.residentUser, apartment_id: ids.apartment, unit_id: ids.unit });
  await post('/rest/v1/landlords', { id: ids.landlord, user_id: ids.landlordUser });

  // Fund the auto-created resident wallet (residents_create_wallet trigger).
  const fundRes = await fetch(`${SUPABASE_URL}/rest/v1/wallets?resident_id=eq.${ids.resident}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ balance: STARTING_BALANCE }),
  });
  if (!fundRes.ok) throw new Error(`funding resident wallet failed: ${fundRes.status} ${await fundRes.text()}`);

  const [residentWalletRes, landlordWalletRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/wallets?resident_id=eq.${ids.resident}&select=id`, { headers: { apikey: SECRET_KEY, Authorization: `Bearer ${SECRET_KEY}` } }),
    fetch(`${SUPABASE_URL}/rest/v1/wallets?user_id=eq.${ids.landlordUser}&select=id`, { headers: { apikey: SECRET_KEY, Authorization: `Bearer ${SECRET_KEY}` } }),
  ]);
  const [residentWallet] = await residentWalletRes.json();
  const [landlordWallet] = await landlordWalletRes.json();
  return { residentWalletId: residentWallet.id, landlordWalletId: landlordWallet.id };
}

async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`sign-in failed: ${res.status} ${JSON.stringify(data)}`);
  return data.access_token;
}

async function fireTransfer(token, senderWalletId, recipientWalletId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/transfer_wallet_funds`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      p_sender_wallet_id: senderWalletId,
      p_recipient_wallet_id: recipientWalletId,
      p_amount: AMOUNT,
      p_type: 'rent_payment',
      p_gateway: 'wallet',
    }),
  });
  return res.status >= 200 && res.status < 300;
}

async function cleanup() {
  const headers = { apikey: SECRET_KEY, Authorization: `Bearer ${SECRET_KEY}`, Prefer: 'return=minimal' };
  const del = (path) => fetch(`${SUPABASE_URL}${path}`, { method: 'DELETE', headers });

  await del(`/rest/v1/transactions?sender_wallet_id=in.(select id from wallets where resident_id=eq.${ids.resident})`).catch(() => {});
  // PostgREST doesn't support subquery filters directly; delete by the
  // known wallet id instead, fetched fresh in case teardown runs standalone.
  const walletRes = await fetch(`${SUPABASE_URL}/rest/v1/wallets?resident_id=eq.${ids.resident}&select=id`, { headers });
  const [wallet] = (await walletRes.json().catch(() => [])) ?? [];
  if (wallet) await del(`/rest/v1/transactions?sender_wallet_id=eq.${wallet.id}`);

  await del(`/rest/v1/wallets?resident_id=eq.${ids.resident}`);
  await del(`/rest/v1/wallets?user_id=eq.${ids.landlordUser}`);
  await del(`/rest/v1/residents?id=eq.${ids.resident}`);
  await del(`/rest/v1/landlords?id=eq.${ids.landlord}`);
  await del(`/rest/v1/units?id=eq.${ids.unit}`);
  await del(`/rest/v1/buildings?id=eq.${ids.building}`);
  await del(`/rest/v1/apartments?id=eq.${ids.apartment}`);
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${ids.residentUser}`, { method: 'DELETE', headers });
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${ids.landlordUser}`, { method: 'DELETE', headers });
}

async function main() {
  console.log('Setting up fixture...');
  const { residentWalletId, landlordWalletId } = await setupFixture();
  const token = await signIn('p18-concurrency.resident@merge.test', 'TestPass123!');

  console.log(`Firing ${N} concurrent transfer_wallet_funds calls of ${AMOUNT} each against a balance of ${STARTING_BALANCE}...`);
  const results = await Promise.all(Array.from({ length: N }, () => fireTransfer(token, residentWalletId, landlordWalletId)));
  const succeeded = results.filter(Boolean).length;
  const failed = N - succeeded;

  const balanceRes = await fetch(`${SUPABASE_URL}/rest/v1/wallets?id=eq.${residentWalletId}&select=balance`, {
    headers: { apikey: SECRET_KEY, Authorization: `Bearer ${SECRET_KEY}` },
  });
  const [{ balance }] = await balanceRes.json();

  console.log(`Succeeded: ${succeeded}, Failed: ${failed}, Final balance: ${balance}`);

  console.log('Cleaning up...');
  await cleanup();

  const pass = succeeded === EXPECTED_SUCCESSES && failed === N - EXPECTED_SUCCESSES && Number(balance) === 0;
  console.log(pass ? 'RESULT: PASS' : 'RESULT: FAIL');
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
