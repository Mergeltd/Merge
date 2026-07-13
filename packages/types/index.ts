import { z } from 'zod';

// ==========================================
// AUTHENTICATION SCHEMAS
// ==========================================

export const RegisterUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['RESIDENT', 'TECHNICIAN', 'PROPERTY_MANAGER', 'LANDLORD']),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginSchema>;

// ==========================================
// SHARED ENUMS
// ==========================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  APARTMENT_ADMIN = 'APARTMENT_ADMIN',
  RESIDENT = 'RESIDENT',
  TECHNICIAN = 'TECHNICIAN',
  LANDLORD = 'LANDLORD',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

// ==========================================
// MAINTENANCE SCHEMAS (Exported from Backend)
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
