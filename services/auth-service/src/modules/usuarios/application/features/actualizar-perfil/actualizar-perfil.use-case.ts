/**
 * ============================================================================
 * Caso de uso: ActualizarPerfil
 * ============================================================================
 * Permite actualizar nombre, apellido, teléfono y email.
 * El email se valida como VO y se verifica que no esté duplicado.
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { Email } from '../../../domain/value-objects/email.vo';
import {
  UsuarioNoEncontradoError,
  UsuarioDuplicadoError,
} from '../../../domain/exceptions/usuario.errors';
import type {
  IActualizarPerfilPort,
  ActualizarPerfilDto,
  UsuarioResponseDto,
} from '../../../domain/ports/in/usuarios.port';
import type { IUsuarioRepository } from '../../../domain/ports/out/usuario.repository.port';
import { toUsuarioResponseDto } from '../../mapper';

export class ActualizarPerfilUseCase implements IActualizarPerfilPort {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(
    usuarioId: string,
    dto: ActualizarPerfilDto,
  ): Promise<Result<UsuarioResponseDto, Error>> {
    // ─── 1. Buscar usuario ──────────────────────────────────────────────────
    const usuario = await this.repo.buscarPorId(usuarioId);
    if (!usuario) {
      return Err(new UsuarioNoEncontradoError(usuarioId));
    }

    // ─── 2. Validar y actualizar email si cambia ────────────────────────────
    if (dto.email && dto.email !== usuario.email.value) {
      const emailResult = Email.create(dto.email);
      if (emailResult.isErr) return Err(emailResult.error);

      const existente = await this.repo.buscarPorEmail(emailResult.value.value);
      if (existente && existente.id !== usuarioId) {
        return Err(new UsuarioDuplicadoError('email', emailResult.value.value));
      }
      // Actualizar el email en la entidad (accediendo al VO interno)
      // Nota: en una implementación más pura, el VO Email sería inmutable y
      // habría un método en la entidad para cambiarlo. Simplificamos aquí
      // al reconstruir la entidad con el nuevo email.
      Object.assign(usuario, { _email: emailResult.value });
    }

    // ─── 3. Actualizar otros campos ─────────────────────────────────────────
    usuario.actualizarPerfil({
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono,
    });

    // ─── 4. Persistir ───────────────────────────────────────────────────────
    await this.repo.actualizar(usuario);

    // ─── 5. Retornar DTO ────────────────────────────────────────────────────
    return Ok(toUsuarioResponseDto(usuario));
  }
}
