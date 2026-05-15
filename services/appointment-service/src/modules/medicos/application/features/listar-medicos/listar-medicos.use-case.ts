/**
 * ============================================================================
 * Caso de uso: ListarMedicos
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type { IListarMedicosPort, MedicoResponseDto } from '@/modules/medicos/domain/ports/in/medicos.port';
import type { IMedicoRepository } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import { toMedicoResponseDto } from '@/modules/medicos/application/mapper';

export class ListarMedicosUseCase implements IListarMedicosPort {
  constructor(private readonly repo: IMedicoRepository) {}

  async execute(): Promise<Result<MedicoResponseDto[], Error>> {
    const medicos = await this.repo.listarTodos();

    const dtos = medicos.map((m) => {
      const { horarios, especialidadNombre, ...medicoBase } = m as any;
      return toMedicoResponseDto(
        medicoBase,
        horarios,
        especialidadNombre,
        {
          nombre: '—',
          apellido: '—',
          dni: '—',
          email: '—',
        },
      );
    });

    return Ok(dtos);
  }
}
