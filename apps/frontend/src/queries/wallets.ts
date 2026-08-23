import { createClient } from '@/lib/supabase/client';

export interface WalletSummary {
  walletId: string;
  balance: number;
  currency: string;
  escrowHeld: number;
}

export interface WalletTransaction {
  id: string;
  label: string;
  type: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REVERSED';
}

const TYPE_LABELS: Record<string, string> = {
  deposit: 'Wallet top-up',
  withdrawal: 'Withdrawal',
  rent_payment: 'Rent payment',
  service_charge: 'Building service charge',
  maintenance_escrow: 'Escrow hold',
  escrow_release: 'Escrow release',
  commission_fee: 'Platform fee',
  collaboration_split: 'Collaboration split',
  refund: 'Refund',
};

export async function getMyWallet(residentId: string): Promise<WalletSummary> {
  const supabase = createClient();
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('id, balance, currency')
    .eq('resident_id', residentId)
    .eq('wallet_type', 'resident')
    .single();

  if (error) throw error;

  // There's no persistent "escrow balance" column on wallets — escrow is
  // represented as pending maintenance_escrow transactions out of this
  // wallet, so it's derived here rather than stored redundantly.
  const { data: escrowRows, error: escrowError } = await supabase
    .from('transactions')
    .select('amount')
    .eq('sender_wallet_id', wallet.id)
    .eq('type', 'maintenance_escrow')
    .eq('status', 'pending');

  if (escrowError) throw escrowError;

  const escrowHeld = (escrowRows ?? []).reduce((sum, row) => sum + Number(row.amount), 0);

  return {
    walletId: wallet.id,
    balance: Number(wallet.balance),
    currency: wallet.currency,
    escrowHeld,
  };
}

export interface TechnicianWalletSummary {
  walletId: string;
  balance: number;
  currency: string;
  pendingPayout: number;
}

export async function getMyTechnicianWallet(technicianId: string): Promise<TechnicianWalletSummary> {
  const supabase = createClient();
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('id, balance, currency')
    .eq('technician_id', technicianId)
    .eq('wallet_type', 'technician')
    .single();

  if (error) throw error;

  // "Pending payout" = completed jobs with no crediting transaction into
  // this wallet yet. Deliberately not using revenue_shares — that table
  // is admin-only by RLS design (audit's revenue_shares_admin_only
  // policy), and PostgREST's `.in()`/`.not()` filters take a literal
  // value list, not an arbitrary SQL subquery, so this has to be two
  // reads plus a client-side diff rather than one query.
  const { data: completedBookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, total_amount')
    .eq('technician_id', technicianId)
    .eq('status', 'completed');
  if (bookingsError) throw bookingsError;

  const { data: creditedTx, error: txError } = await supabase
    .from('transactions')
    .select('booking_id')
    .eq('recipient_wallet_id', wallet.id)
    .not('booking_id', 'is', null);
  if (txError) throw txError;

  const creditedBookingIds = new Set((creditedTx ?? []).map((t) => t.booking_id));
  const pendingPayout = (completedBookings ?? [])
    .filter((b) => !creditedBookingIds.has(b.id))
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  return {
    walletId: wallet.id,
    balance: Number(wallet.balance),
    currency: wallet.currency,
    pendingPayout,
  };
}

export interface SimpleWalletSummary {
  walletId: string;
  balance: number;
  currency: string;
}

export async function getMyLandlordWallet(userId: string): Promise<SimpleWalletSummary> {
  const supabase = createClient();
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('id, balance, currency')
    .eq('user_id', userId)
    .eq('wallet_type', 'landlord')
    .single();

  if (error) throw error;
  return { walletId: wallet.id, balance: Number(wallet.balance), currency: wallet.currency };
}

export async function getWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('id, reference, amount, type, status, sender_wallet_id, created_at')
    .or(`sender_wallet_id.eq.${walletId},recipient_wallet_id.eq.${walletId}`)
    .order('created_at', { ascending: false })
    .range(0, 19); // first page — full pagination lands with the finance pages that need it more urgently

  if (error) throw error;

  return data.map((row) => ({
    id: row.reference,
    label: TYPE_LABELS[row.type] ?? row.type,
    type: row.type,
    amount: row.sender_wallet_id === walletId ? -Number(row.amount) : Number(row.amount),
    date: new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
    status: row.status.toUpperCase() as WalletTransaction['status'],
  }));
}
