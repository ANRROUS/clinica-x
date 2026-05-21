/**
 * Validación de variables de entorno con Zod.
 * Si falta o es inválida alguna, el proceso falla inmediatamente con un
 * mensaje claro (fail fast).
 */

import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET debe tener al menos 8 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  INTERNAL_API_KEY: z.string().min(8).default('internal-dev-key-change-in-prod'),
  SUPABASE_EDGE_FUNCTION_URL: z.string().url().default('http://localhost:54321/functions/v1'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY es requerida'),
  INTERNAL_EMAIL_SECRET: z.string().min(8, 'INTERNAL_EMAIL_SECRET debe tener al menos 8 caracteres'),
  FRONTEND_URL: z.string().url().default('http://localhost:3100'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[auth-service] ❌ Variables de entorno inválidas:');
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
