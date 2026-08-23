import { z } from 'zod';

// ==========================================
// SHARED CONSTANTS (Replacing Enums)
// ==========================================

// Canonical 6-value role set (docs/migration/plan.md ADR-001). Previously
// missing PROPERTY_MANAGER here while RegisterUserSchema below allowed it,
// and separately missing SUPER_ADMIN/APARTMENT_ADMIN there — this is now
// the single list both draw from.
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  APARTMENT_ADMIN: 'APARTMENT_ADMIN',
  PROPERTY_MANAGER: 'PROPERTY_MANAGER',
  LANDLORD: 'LANDLORD',
  RESIDENT: 'RESIDENT',
  TECHNICIAN: 'TECHNICIAN',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

// Roles selectable on the public registration form. super_admin and
// apartment_admin are provisioned directly (docs/migration/plan.md Phase 4),
// never self-registered.
export const SELF_SERVICE_ROLES = [
  UserRole.RESIDENT,
  UserRole.TECHNICIAN,
  UserRole.PROPERTY_MANAGER,
  UserRole.LANDLORD,
] as const;

export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED',
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

// ==========================================
// AUTHENTICATION SCHEMAS
// ==========================================

export const RegisterUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(SELF_SERVICE_ROLES),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginSchema>;

// ==========================================
// MAINTENANCE SCHEMAS
// ==========================================
export const CreateMaintenanceRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  residentId: z.string().uuid(),
  unitId: z.string().uuid(),
  categoryId: z.string().uuid(),
  mediaKeys: z.array(z.string()).optional(),
});

export type CreateMaintenanceRequestDto = z.infer<typeof CreateMaintenanceRequestSchema>;
