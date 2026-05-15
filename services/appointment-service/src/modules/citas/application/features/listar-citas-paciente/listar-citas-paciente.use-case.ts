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

    const dtos: CitaResponseDto[] = [];
    for (const cita of citas) {
      const medico = await this.medicoReader.buscarPorId(cita.medicoId);
      dtos.push(
        toCitaResponseDto(cita, {
          doctorName: medico?.nombreUsuario,
          specialty: medico?.especialidadNombre,
        }),
      );
    }

    return Ok(dtos);
  }
}
