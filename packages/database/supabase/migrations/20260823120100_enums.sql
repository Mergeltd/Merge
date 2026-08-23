-- docs/migration/plan.md Phase 3.
create type user_role as enum (
  'super_admin', 'apartment_admin', 'property_manager',
  'landlord', 'resident', 'technician'
);
-- Canonical 6-value set (docs/migration/plan.md ADR-001). Replaces Prisma's
-- User/Role/Permission/RolePermission four-table RBAC design — the backend
-- audit confirmed Permission/RolePermission were never actually read by any
-- service, only Role.name string comparisons. See docs/migration/plan.md
-- §13 (Authentication Architecture in the audit) for the full rationale.

create type user_status as enum ('pending', 'active', 'suspended', 'deactivated');
create type occupancy_status as enum ('vacant', 'occupied', 'maintenance');
create type tech_status as enum ('pending_verification', 'verified', 'suspended', 'rejected');
create type request_urgency as enum ('low', 'medium', 'high', 'critical');
create type request_status as enum ('open', 'assigned', 'in_progress', 'completed', 'cancelled');
create type booking_status as enum ('proposed', 'accepted', 'declined', 'in_route', 'work_started', 'completed', 'cancelled');
create type collaboration_status as enum ('proposed', 'active', 'settled', 'cancelled');
create type wallet_type as enum ('resident', 'technician', 'landlord', 'building_maintenance', 'platform_commission');
create type wallet_status as enum ('active', 'frozen', 'suspended');
create type transaction_type as enum ('deposit', 'withdrawal', 'rent_payment', 'service_charge', 'maintenance_escrow', 'escrow_release', 'commission_fee', 'collaboration_split', 'refund');
create type transaction_status as enum ('pending', 'successful', 'failed', 'reversed');
create type payment_gateway as enum ('mpesa_daraja', 'stripe', 'wallet');
create type vacancy_status as enum ('draft', 'published', 'under_contract', 'archived');
create type application_status as enum ('submitted', 'reviewing', 'approved', 'declined');
create type chat_type as enum ('direct', 'job_group', 'community_board');
create type message_type as enum ('text', 'image', 'document', 'location');
create type ai_role as enum ('system', 'user', 'assistant');
create type subscription_status as enum ('active', 'past_due', 'cancelled', 'unpaid');
create type subscriber_type as enum ('apartment', 'technician');
