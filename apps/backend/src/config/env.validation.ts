import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().min(32),
  THROTTLE_LIMIT: z.string().default('10'),
  THROTTLE_TTL: z.string().default('60'),
  REDIS_URL: z.string().url().optional(),
});

export const validateEnv = (config: Record<string, unknown>) => {
  return envSchema.parse(config);
};
