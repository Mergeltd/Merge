-- docs/migration/plan.md Phase 9. The already-built CreateListingModal
-- collects a neighborhood for every new listing, but vacancies only had
-- location reachable via an optional unit -> building -> apartment chain
-- — fine for a listing tied to an existing modeled unit, but most new
-- landlord listings won't have one (that's the "standalone unit" case,
-- not yet represented as a full apartment/building/unit record). A
-- vacancy's neighborhood shouldn't depend on whether it happens to be
-- linked to internal unit bookkeeping.
alter table public.vacancies add column neighborhood text;
