/**
 * Mapeo de rutas → microservicio destino.
 * Cada entrada describe un prefijo y el upstream al que debe enrutar.
 */
import { env } from '../env';

export interface RutaProxy {
  prefijo: string;
  upstream: string;
  servicio: string;
  /** Si true, no requiere JWT (rutas públicas). */
  publica?: boolean;
}

export const rutasProxy: RutaProxy[] = [
  // --- auth-service ---
  // Login / register son públicos. /api/auth/me requiere token.
  // El gateway no diferencia sub-paths — usamos middlewares específicos
  // para las rutas públicas antes del jwtMiddleware.
  {
    prefijo: '/api/auth',
    upstream: env.AUTH_SERVICE_URL,
    servicio: 'auth-service',
  },
  // --- appointment-service (incluye admin y appointments) ---
  {
    prefijo: '/api/admin',
    upstream: env.APPOINTMENT_SERVICE_URL,
    servicio: 'appointment-service',
  },
  {
    prefijo: '/api/appointments',
    upstream: env.APPOINTMENT_SERVICE_URL,
    servicio: 'appointment-service',
  },
  // --- clinical-service ---
  {
    prefijo: '/api/medical',
    upstream: env.CLINICAL_SERVICE_URL,
    servicio: 'clinical-service',
  },
  // --- file-service ---
  {
    prefijo: '/api/files',
    upstream: env.FILE_SERVICE_URL,
    servicio: 'file-service',
  },
  // --- ocr-service ---
  {
    prefijo: '/api/ocr',
    upstream: env.OCR_SERVICE_URL,
    servicio: 'ocr-service',
  },
];

/**
 * Rutas que NO requieren JWT.
 * Estas se chequean explícitamente antes del middleware de auth.
 */
export const rutasPublicas: string[] = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/health',
];
