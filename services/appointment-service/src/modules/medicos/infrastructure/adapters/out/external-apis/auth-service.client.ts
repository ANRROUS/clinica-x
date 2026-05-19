/**
 * ============================================================================
 * AuthServiceClient — Adaptador de salida para comunicación cross-service
 * ============================================================================
 * Llama al auth-service vía HTTP para crear/actualizar usuarios médicos.
 * ============================================================================
 */

import { env } from '@/env';
import { logger } from '@/shared/logger';
import type { IAuthServiceClient } from '@/modules/medicos/domain/ports/out/medico.repository.port';

export class AuthServiceClient implements IAuthServiceClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.AUTH_SERVICE_URL;
  }

  async crearUsuarioMedico(dto: {
    dni: string;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
  }): Promise<{ id: string }> {
    const url = `${this.baseUrl}/api/auth/register`;
    logger.debug({ url }, 'Llamando a auth-service para crear usuario médico');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': env.INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        dni: dto.dni,
        email: dto.email,
        password: dto.password,
        nombre: dto.nombre,
        apellido: dto.apellido,
        telefono: dto.telefono,
        rol: 'MEDICO',
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error({ status: response.status, body: text }, 'auth-service respondió error al crear usuario');
      throw new Error(`Auth-service error ${response.status}: ${text}`);
    }

    const json = (await response.json()) as any;
    return { id: json.data.usuario.id };
  }

  async actualizarUsuario(
    usuarioId: string,
    dto: {
      nombre?: string;
      apellido?: string;
      dni?: string;
      email?: string;
      telefono?: string;
      password?: string;
    },
  ): Promise<void> {
    // Nota: auth-service no expone PUT /api/auth/me/:id aún.
    // En desarrollo local, hacemos una llamada interna simulada.
    // Para producción, auth-service debería exponer un endpoint de admin.
    logger.warn({ usuarioId, dto }, 'actualizarUsuario en auth-service: stub — se necesita endpoint admin en auth-service');
    // Stub: no hacemos nada por ahora. En una implementación real,
    // se llamaría a un endpoint tipo PUT /api/admin/users/:id
  }
}
