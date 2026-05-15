/**
 * Validación de variables de entorno del api-gateway.
 */
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  AUTH_SERVICE_URL: z.string().url(),
  APPOINTMENT_SERVICE_URL: z.string().url(),
  CLINICAL_SERVICE_URL: z.string().url(),
  FILE_SERVICE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET debe tener al menos 8 caracteres'),
  CORS_ORIGIN: z.string().default('http://localhost:3100'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[api-gateway] ❌ Variables de entorno inválidas:');
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
