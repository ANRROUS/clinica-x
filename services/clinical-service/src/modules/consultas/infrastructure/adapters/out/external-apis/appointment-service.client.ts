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
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Api-Key': this.apiKey,
        },
        body: JSON.stringify({ estado: 'COMPLETADA' }),
      });

      if (!response.ok) {
        logger.error({ status: response.status, citaId }, 'appointment-service respondió error al completar cita');
        return false;
      }

      return true;
    } catch (err) {
      logger.error({ err, citaId }, 'Error de red al llamar a appointment-service para completar cita');
      return false;
    }
  }
}
