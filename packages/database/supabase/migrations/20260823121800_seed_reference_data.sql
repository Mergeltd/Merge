-- docs/migration/plan.md Phase 3. Reference data every environment needs
-- (unlike supabase/seed.sql, which is dev/staging-only fake data — Phase
-- 20). Categories match the trade list the README's strategic pillars
-- describe ("plumbers, electricians, carpenters, painters, etc.") and
-- Prisma's own Category model comment ("Plumbing, Electrical, HVAC, etc.").
insert into public.categories (name, slug, description) values
  ('Plumbing', 'plumbing', 'Leaks, pipes, fixtures, water heaters'),
  ('Electrical', 'electrical', 'Wiring, outlets, lighting, circuit breakers'),
  ('HVAC', 'hvac', 'Heating, ventilation, and air conditioning'),
  ('Carpentry', 'carpentry', 'Doors, cabinets, furniture, general woodwork'),
  ('Painting', 'painting', 'Interior and exterior painting'),
  ('Appliance Repair', 'appliance-repair', 'Fridges, washers, ovens, and other appliances'),
  ('Pest Control', 'pest-control', 'Extermination and prevention'),
  ('Cleaning', 'cleaning', 'Deep cleaning and move-out cleaning'),
  ('Locksmith', 'locksmith', 'Locks, keys, and access control'),
  ('General Maintenance', 'general-maintenance', 'Everything not covered by a specific trade');

-- Referenced by name in settle_booking_revenue()
-- (20260823121400_business_functions.sql) and by Prisma's own Setting
-- model comment ("SYSTEM_COMMISSION_PERCENTAGE, MPESA_TIMEOUT_LIMIT,
-- etc."). Kept to exactly the two the schema already named — add more
-- only when a real feature reads them, per docs/migration/plan.md Rule 2.
insert into public.settings (key, value, "group", description) values
  ('SYSTEM_COMMISSION_PERCENTAGE', '10', 'PAYMENT', 'Platform''s cut of each completed booking, as a percentage'),
  ('MPESA_TIMEOUT_LIMIT', '120', 'PAYMENT', 'Seconds to wait for an M-Pesa STK push response before treating it as failed');
