// This used to be a byte-identical hand-written duplicate of
// packages/types/index.ts (see docs/migration/plan.md §1.3 / ADR-007),
// which is how the two drifted — RegisterUserSchema and UserRole disagreed
// on the role list. Re-exporting keeps the existing `@/shared-types` import
// path working for login-client.tsx/register-client.tsx without a second
// copy to drift again. This file goes away once Phase 3 lands generated
// Supabase types as the single source of truth for table shapes.
export * from '@merge/types';
