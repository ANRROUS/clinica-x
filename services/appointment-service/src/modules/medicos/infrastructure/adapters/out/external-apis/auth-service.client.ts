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

class AuthServiceClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

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
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = null;
      }
      const code = errorBody?.error?.codigo || 'AUTH_SERVICE_ERROR';
      const message = errorBody?.error?.mensaje || 'Error desconocido del auth-service';
      logger.error({ status: response.status, code, message }, 'auth-service respondió error al crear usuario');
      throw new AuthServiceClientError(response.status, code, message);
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
    const url = `${this.baseUrl}/api/auth/internal/users/${encodeURIComponent(usuarioId)}`;
    logger.debug({ url, usuarioId }, 'Llamando a auth-service para actualizar usuario');

    const body: Record<string, unknown> = {};
    if (dto.nombre) body.nombre = dto.nombre;
    if (dto.apellido) body.apellido = dto.apellido;
    if (dto.dni) body.dni = dto.dni;
    if (dto.email) body.email = dto.email;
    if (dto.telefono !== undefined) body.telefono = dto.telefono;
    if (dto.password) body.password = dto.password;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': env.INTERNAL_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = null;
      }
      const code = errorBody?.error?.codigo || 'AUTH_SERVICE_ERROR';
      const message = errorBody?.error?.mensaje || 'Error desconocido del auth-service';
      logger.error({ status: response.status, code, message }, 'auth-service respondió error al actualizar usuario');
      throw new AuthServiceClientError(response.status, code, message);
    }
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
        'X-Internal-Api-Key': env.INTERNAL_API_KEY,
      },
    });

    if (!response.ok) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = null;
      }
      const code = errorBody?.error?.codigo || 'AUTH_SERVICE_ERROR';
      const message = errorBody?.error?.mensaje || 'Error desconocido del auth-service';
      logger.error({ status: response.status, code, message }, 'auth-service respondió error al obtener usuarios');
      throw new AuthServiceClientError(response.status, code, message);
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
