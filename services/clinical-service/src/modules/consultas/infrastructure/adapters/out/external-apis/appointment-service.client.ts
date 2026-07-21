/**
 * ============================================================================
 * AppointmentServiceClient — Adaptador de salida para comunicación cross-service
 * ============================================================================
 * Llama al appointment-service vía HTTP para actualizar el estado de citas.
 * ============================================================================
 */

import { env } from '@/env';
import { logger } from '@/shared/logger';
import type { IAppointmentServiceClient } from '@/modules/consultas/domain/ports/out/appointment-service.port';
import { withRetry } from '@/shared/retry';

export class AppointmentServiceClient implements IAppointmentServiceClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = env.APPOINTMENT_SERVICE_URL;
    this.apiKey = env.INTERNAL_API_KEY;
  }

  async completarCita(citaId: string): Promise<boolean> {
    const url = `${this.baseUrl}/api/appointments/doctor/${citaId}/status`;
    logger.debug({ url, citaId }, 'Llamando a appointment-service para completar cita');

    try {
      // Retry con Exponential Backoff: reintenta ante errores de red (hasta 3 veces).
      // Los errores HTTP de negocio (4xx/5xx) no lanzan — devuelven false directamente.
      return await withRetry(async () => {
        // TimeLimiter: cancela la petición si appointment-service no responde en 30 s.
        const controller = new AbortController();
        const timerId = setTimeout(() => controller.abort(), 30_000);

        try {
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-Internal-Api-Key': this.apiKey,
            },
            body: JSON.stringify({ estado: 'COMPLETADA' }),
            signal: controller.signal,
          });
          clearTimeout(timerId);

          if (!response.ok) {
            // Error de negocio: no reintenta, devuelve false
            logger.error({ status: response.status, citaId }, 'appointment-service respondió error al completar cita');
            return false;
          }

          return true;
        } catch (err) {
          clearTimeout(timerId);
          throw err; // Error de red → withRetry reintentará con backoff
        }
      }, { maxAttempts: 3, baseDelayMs: 200, maxDelayMs: 2_000, factor: 2 });
    } catch (err) {
      // Se agotaron los 3 intentos
      logger.error({ err, citaId }, 'Error de red al completar cita (reintentos agotados)');
      return false;
    }
  }
}
