/**
 * ============================================================================
 * Caso de uso: ListarCitasPaciente
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type {
  IListarCitasPacientePort,
  ListarCitasPacienteDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';

export class ListarCitasPacienteUseCase implements IListarCitasPacientePort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: ListarCitasPacienteDto): Promise<Result<CitaResponseDto[], Error>> {
    const citas = await this.repo.buscarPorPaciente(dto.pacienteId);
    if (citas.length === 0) return Ok([]);

    const medicoIds = [...new Set(citas.map((c) => c.medicoId))];
    const medicosMap = await this.medicoReader.buscarPorIds(medicoIds);

    const dtos: CitaResponseDto[] = citas.map((cita) => {
      const medico = medicosMap.get(cita.medicoId);
      return toCitaResponseDto(cita, {
        doctorName: medico?.nombreUsuario,
        specialty: medico?.especialidadNombre,
      });
    });

    return Ok(dtos);
  }
}
