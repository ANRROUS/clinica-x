/**
 * ==========================================================================
 * Caso de uso: ListarUsuariosPorIds
 * ==========================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type {
  IListarUsuariosPorIdsPort,
  UsuarioResponseDto,
} from '@/modules/usuarios/domain/ports/in/usuarios.port';
import type { IUsuarioRepository } from '@/modules/usuarios/domain/ports/out/usuario.repository.port';
import { toUsuarioResponseDto } from '@/modules/usuarios/application/mapper';

export class ListarUsuariosPorIdsUseCase implements IListarUsuariosPorIdsPort {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(ids: string[]): Promise<Result<UsuarioResponseDto[], Error>> {
    const usuarios = await this.repo.buscarPorIds(ids);
    return Ok(usuarios.map(toUsuarioResponseDto));
  }
}
