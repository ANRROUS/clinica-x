/**
 * ============================================================================
 * Caso de uso: CambiarEstadoMedico
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { MedicoNoEncontradoError } from '@/modules/medicos/domain/exceptions/medico.errors';
import type { ICambiarEstadoMedicoPort, CambiarEstadoMedicoDto } from '@/modules/medicos/domain/ports/in/medicos.port';
import type { IMedicoRepository } from '@/modules/medicos/domain/ports/out/medico.repository.port';

export class CambiarEstadoMedicoUseCase implements ICambiarEstadoMedicoPort {
  constructor(private readonly repo: IMedicoRepository) {}

  async execute(medicoId: string, dto: CambiarEstadoMedicoDto): Promise<Result<{ id: string; activo: boolean }, Error>> {
    const medico = await this.repo.buscarPorId(medicoId);
    if (!medico) {
      return Err(new MedicoNoEncontradoError(medicoId));
    }

    const medicoBase = medico as any;
    medicoBase.cambiarEstado(dto.activo);
    await this.repo.actualizar(medicoBase);

    return Ok({ id: medicoId, activo: dto.activo });
  }
}
