/**
 * ============================================================================
 * Caso de uso: CambiarEstadoCita
 * ============================================================================
 * Usado por el médico para iniciar atención o completar una cita.
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { CitaNoEncontradaError } from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  ICambiarEstadoCitaPort,
  CambiarEstadoCitaDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';

export class CambiarEstadoCitaUseCase implements ICambiarEstadoCitaPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(citaId: string, dto: CambiarEstadoCitaDto): Promise<Result<CitaResponseDto, Error>> {
    const cita = await this.repo.buscarPorId(citaId);
    if (!cita) {
      return Err(new CitaNoEncontradaError(citaId));
    }

    if (dto.estado === 'EN_ATENCION') {
      cita.iniciarAtencion();
    } else if (dto.estado === 'COMPLETADA') {
      cita.completar();
    } else if (dto.estado === 'CANCELADA') {
      cita.cancelar();
    } else {
      // CONFIRMADA — no hace nada de negocio especial
    }

    await this.repo.actualizar(cita);

    const medico = await this.medicoReader.buscarPorId(cita.medicoId);
    return Ok(
      toCitaResponseDto(cita, {
        doctorName: medico?.nombreUsuario,
        specialty: medico?.especialidadNombre,
      }),
    );
  }
}
