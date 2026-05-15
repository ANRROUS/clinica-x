/**
 * ============================================================================
 * Caso de uso: ObtenerPerfil
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { UsuarioNoEncontradoError } from '../../../domain/exceptions/usuario.errors';
import type {
  IObtenerPerfilPort,
  UsuarioResponseDto,
} from '../../../domain/ports/in/usuarios.port';
import type { IUsuarioRepository } from '../../../domain/ports/out/usuario.repository.port';
import { toUsuarioResponseDto } from '../../mapper';

export class ObtenerPerfilUseCase implements IObtenerPerfilPort {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(usuarioId: string): Promise<Result<UsuarioResponseDto, Error>> {
    const usuario = await this.repo.buscarPorId(usuarioId);
    if (!usuario) {
      return Err(new UsuarioNoEncontradoError(usuarioId));
    }
    return Ok(toUsuarioResponseDto(usuario));
  }
}
