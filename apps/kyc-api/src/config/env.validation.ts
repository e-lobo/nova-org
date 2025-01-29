import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform((val) => parseInt(val, 10)),
  API_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
  CORS_ORIGIN: z.string().url().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform((val) => parseInt(val, 10)),
  JWT_SECRET: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;
