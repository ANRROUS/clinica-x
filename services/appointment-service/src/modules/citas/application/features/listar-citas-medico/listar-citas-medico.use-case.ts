/**
 * ============================================================================
 * Caso de uso: ListarCitasMedico
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type {
  IListarCitasMedicoPort,
  ListarCitasMedicoDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';

export class ListarCitasMedicoUseCase implements IListarCitasMedicoPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: ListarCitasMedicoDto): Promise<Result<CitaResponseDto[], Error>> {
    const citas = await this.repo.buscarPorMedico(
      dto.medicoId,
      dto.fechaDesde,
      dto.fechaHasta,
    );

    const medico = await this.medicoReader.buscarPorId(dto.medicoId);

    const dtos = citas.map((cita) =>
      toCitaResponseDto(cita, {
        doctorName: medico?.nombreUsuario,
        specialty: medico?.especialidadNombre,
      }),
    );

    return Ok(dtos);
  }
}
