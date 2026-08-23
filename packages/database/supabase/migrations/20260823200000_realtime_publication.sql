-- docs/migration/plan.md Phase 14. Supabase Realtime only broadcasts
-- postgres_changes for tables explicitly added to the supabase_realtime
-- publication — without this, the client-side .channel().on('postgres_changes')
-- subscriptions added this phase would silently receive nothing. Scoped to
-- exactly the 2 tables this phase actually subscribes to (notifications,
-- bookings); messages/chats are deliberately not added since no chat UI
-- exists yet to consume it (see docs/migration/progress.md Phase 14).
-- maintenance_requests is included alongside bookings because a
-- resident's own request only has a direct resident_id column on
-- maintenance_requests, not on bookings — see the note in
-- hooks/use-maintenance-requests.ts.
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.maintenance_requests;
