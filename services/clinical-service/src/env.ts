/**
 * Validación de variables de entorno de clinical-service con Zod.
 */
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3002),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET debe tener al menos 8 caracteres'),
  // IA — por defecto desactivada en MVP
  AI_ENABLED: z
    .string()
    .default('false')
    .transform((v) => v.toLowerCase() === 'true'),
  OPENAI_API_KEY: z.string().optional(),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  // URLs cross-service
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:3000'),
  APPOINTMENT_SERVICE_URL: z.string().url().default('http://localhost:3001'),
  FILE_SERVICE_URL: z.string().url().default('http://localhost:3003'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[clinical-service] ❌ Variables de entorno inválidas:');
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
