/**
 * ============================================================================
 * AuthServiceClient — Adaptador de salida para comunicación cross-service
 * ============================================================================
 * Llama al auth-service vía HTTP para obtener datos de usuarios.
 * ============================================================================
 */

import { env } from '@/env';
import { logger } from '@/shared/logger';
import type { IAuthServiceClient } from '@/modules/consultas/domain/ports/out/auth-service.port';

export class AuthServiceClient implements IAuthServiceClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = env.AUTH_SERVICE_URL;
    this.apiKey = env.INTERNAL_API_KEY;
  }

  async obtenerUsuariosPorIds(ids: string[]): Promise<Array<{
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono?: string;
  }>> {
    if (ids.length === 0) return [];
    const url = `${this.baseUrl}/api/auth/internal/users?ids=${encodeURIComponent(ids.join(','))}`;
    logger.debug({ url, total: ids.length }, 'Llamando a auth-service para obtener usuarios por ids');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      logger.error({ status: response.status }, 'auth-service respondió error al obtener usuarios');
      return [];
    }

    const json = (await response.json()) as any;
    return (json.data?.usuarios ?? []) as Array<{
      id: string;
      nombre: string;
      apellido: string;
      dni: string;
      email: string;
      telefono?: string;
    }>;
  }
}
