import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3004),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET debe tener al menos 8 caracteres'),

  OCR_SPACE_API_KEY: z.string().min(1, 'OCR_SPACE_API_KEY es requerida'),
  OCR_SPACE_API_URL: z.string().url().default('https://api.ocr.space/parse/image'),
  OCR_SPACE_ENGINE: z.coerce.number().int().default(2),
  OCR_SPACE_LANGUAGE: z.string().default('spa'),

  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY es requerida'),
  SUPABASE_BUCKET: z.string().default('clinica-x-archivos'),

  FILE_SERVICE_URL: z.string().url().default('http://localhost:3003'),
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:3005'),

  INTERNAL_API_KEY: z.string().default('internal-dev-key-change-in-prod'),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[ocr-service] Variables de entorno inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
