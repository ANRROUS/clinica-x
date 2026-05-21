/**
 * ============================================================================
 * Caso de uso: CancelarCita
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import type { EstadoCita } from '@clinica-x/shared-types';
import {
  CitaNoEncontradaError,
  CitaYaCanceladaError,
  NoSePuedeCancelarError,
  PacienteNoAutorizadoError,
} from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  ICancelarCitaPort,
  CancelarCitaDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import { nowLima } from '@clinica-x/date-utils';

export class CancelarCitaUseCase implements ICancelarCitaPort {
  constructor(private readonly repo: ICitaRepository) {}

  async execute(citaId: string, dto: CancelarCitaDto): Promise<Result<{ id: string; estado: EstadoCita }, Error>> {
    const cita = await this.repo.buscarPorId(citaId);
    if (!cita) {
      return Err(new CitaNoEncontradaError(citaId));
    }

    if (!cita.esPropietario(dto.pacienteId)) {
      return Err(new PacienteNoAutorizadoError());
    }

    if (cita.estado === 'CANCELADA') {
      return Err(new CitaYaCanceladaError());
    }

    if (!cita.puedeCancelarOReprogramar(nowLima())) {
      return Err(new NoSePuedeCancelarError());
    }

    cita.cancelar();
    await this.repo.actualizar(cita);

    return Ok({ id: cita.id, estado: cita.estado });
  }
}
