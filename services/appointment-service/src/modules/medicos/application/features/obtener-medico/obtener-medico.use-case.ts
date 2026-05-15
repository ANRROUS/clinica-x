/**
 * ============================================================================
 * Caso de uso: ObtenerMedico
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { MedicoNoEncontradoError } from '@/modules/medicos/domain/exceptions/medico.errors';
import type { IObtenerMedicoPort, MedicoResponseDto } from '@/modules/medicos/domain/ports/in/medicos.port';
import type { IMedicoRepository } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import { toMedicoResponseDto } from '@/modules/medicos/application/mapper';

export class ObtenerMedicoUseCase implements IObtenerMedicoPort {
  constructor(private readonly repo: IMedicoRepository) {}

  async execute(medicoId: string): Promise<Result<MedicoResponseDto, Error>> {
    const medicoRaw = await this.repo.buscarPorId(medicoId);
    if (!medicoRaw) {
      return Err(new MedicoNoEncontradoError(medicoId));
    }

    const { horarios, especialidadNombre, ...medicoBase } = medicoRaw as any;

    return Ok(
      toMedicoResponseDto(
        medicoBase,
        horarios,
        especialidadNombre,
        {
          nombre: '—',
          apellido: '—',
          dni: '—',
          email: '—',
        },
      ),
    );
  }
}
