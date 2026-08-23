-- docs/migration/plan.md Phase 3. See the MERGE Supabase Migration Audit §11
-- for full design rationale.
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists citext;     -- case-insensitive email
