/**
 * ============================================================================
 * Caso de uso: ListarMedicos
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type { IListarMedicosPort, MedicoResponseDto } from '@/modules/medicos/domain/ports/in/medicos.port';
import type { IAuthServiceClient, IMedicoRepository } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import { toMedicoResponseDto } from '@/modules/medicos/application/mapper';
import { logger } from '@/shared/logger';

export class ListarMedicosUseCase implements IListarMedicosPort {
  constructor(
    private readonly repo: IMedicoRepository,
    private readonly authClient: IAuthServiceClient,
  ) {}

  async execute(): Promise<Result<MedicoResponseDto[], Error>> {
    const medicos = await this.repo.listarTodos();

    const usuarioIds = Array.from(
      new Set(medicos.map(({ medico }) => medico.usuarioId).filter(Boolean)),
    );
    let usuariosPorId = new Map<string, {
      id: string;
      nombre: string;
      apellido: string;
      dni: string;
      email: string;
      telefono?: string;
    }>();

    if (usuarioIds.length > 0) {
      try {
        const usuarios = await this.authClient.obtenerUsuariosPorIds(usuarioIds);
        usuariosPorId = new Map(usuarios.map((u) => [u.id, u]));
      } catch (err) {
        logger.error({ err, totalUsuarioIds: usuarioIds.length }, 'Error al obtener datos de usuarios desde auth-service. Los nombres no se mostrarán.');
        usuariosPorId = new Map();
      }
    }

    const dtos = medicos.map(({ medico, horarios, especialidadNombre }) =>
      toMedicoResponseDto(
        medico,
        horarios,
        especialidadNombre,
        (() => {
          const datos = usuariosPorId.get(medico.usuarioId);
          return {
            nombre: datos?.nombre ?? '—',
            apellido: datos?.apellido ?? '—',
            dni: datos?.dni ?? '—',
            email: datos?.email ?? '—',
            telefono: datos?.telefono,
          };
        })(),
      ),
    );

    return Ok(dtos);
  }
}
