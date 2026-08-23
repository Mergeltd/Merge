// Maps known Postgres/PostgREST errors to user-facing messages, so a raw
// database error never reaches the UI (docs/migration/plan.md Phase 6 /
// Phase 18 error-mapping requirement). Extend the PG_ERROR_MESSAGES /
// MESSAGE_BY_CONTENT tables as later phases add new constraints and RPCs
// (e.g. Phase 11's booking-status-transition checks, Phase 13's payment
// Edge Functions) — don't invent handling for errors that don't exist yet.

interface PostgrestLikeError {
  code?: string;
  message?: string;
  details?: string | null;
}

// SQLSTATE-keyed messages, for errors identifiable purely by code.
const PG_ERROR_MESSAGES: Record<string, string> = {
  '42501': "You don't have permission to do that.",
  '23503': 'That action refers to something that no longer exists.',
};

// P0001 is a plain `raise exception` from a PL/pgSQL function (e.g.
// transfer_wallet_funds) — the message text itself is the signal, not the
// code, so match on message content instead.
const MESSAGE_BY_CONTENT: Array<{ match: string; message: string }> = [
  { match: 'insufficient_funds', message: "This wallet doesn't have enough balance for that." },
  { match: 'booking_not_found', message: 'That booking no longer exists.' },
];

// Unique-constraint violations (23505) need the constraint name to give a
// specific message — Postgres includes it in `details`/`message`.
const UNIQUE_CONSTRAINT_MESSAGES: Record<string, string> = {
  reviews_booking_id_author_id_key: "You've already reviewed this booking.",
  transactions_reference_key: 'That transaction reference is already in use — please retry.',
  profiles_email_key: 'An account with that email already exists.',
  profiles_phone_number_key: 'An account with that phone number already exists.',
  technicians_id_number_key: 'That ID number is already registered to another technician.',
};

export function toUserMessage(error: unknown): string {
  const err = error as PostgrestLikeError;
  const code = err?.code;
  const message = err?.message ?? '';

  if (code === '23505') {
    const constraint = Object.keys(UNIQUE_CONSTRAINT_MESSAGES).find((key) =>
      message.includes(key)
    );
    if (constraint) return UNIQUE_CONSTRAINT_MESSAGES[constraint];
    return 'That already exists.';
  }

  if (code && PG_ERROR_MESSAGES[code]) {
    return PG_ERROR_MESSAGES[code];
  }

  const contentMatch = MESSAGE_BY_CONTENT.find(({ match }) => message.includes(match));
  if (contentMatch) return contentMatch.message;

  return 'Something went wrong. Please try again.';
}
