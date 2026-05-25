/**
 * ============================================================================
 * Caso de uso: ReprogramarCita
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import {
  CitaNoEncontradaError,
  NoSePuedeReprogramarError,
  PacienteNoAutorizadoError,
  SlotNoDisponibleError,
} from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  IReprogramarCitaPort,
  ReprogramarCitaDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';
import { nowLima } from '@clinica-x/date-utils';

export class ReprogramarCitaUseCase implements IReprogramarCitaPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(citaId: string, dto: ReprogramarCitaDto): Promise<Result<CitaResponseDto, Error>> {
    const cita = await this.repo.buscarPorId(citaId);
    if (!cita) {
      return Err(new CitaNoEncontradaError(citaId));
    }

    if (!cita.esPropietario(dto.pacienteId)) {
      return Err(new PacienteNoAutorizadoError());
    }

    if (cita.estado === 'CANCELADA') {
      return Err(new NoSePuedeReprogramarError());
    }

    if (!cita.puedeCancelarOReprogramar(nowLima())) {
      return Err(new NoSePuedeReprogramarError());
    }

    const ahora = nowLima();
    const diffMs = dto.nuevaFechaHora.getTime() - ahora.getTime();
    if (diffMs <= 0) {
      return Err(new SlotNoDisponibleError('Debes reprogramar a una fecha futura'));
    }

    // Verificar que el nuevo slot esté libre y actualizar atómicamente
    const inicioRango = new Date(dto.nuevaFechaHora.getTime() - 1);
    const finRango = new Date(dto.nuevaFechaHora.getTime() + 30 * 60 * 1000);

    cita.reprogramar(dto.nuevaFechaHora);
    const actualizada = await this.repo.actualizarSiLibre(cita, inicioRango, finRango);
    if (!actualizada) {
      return Err(new SlotNoDisponibleError('El nuevo horario ya no está disponible'));
    }

    const medico = await this.medicoReader.buscarPorId(cita.medicoId);
    return Ok(
      toCitaResponseDto(cita, {
        doctorName: medico?.nombreUsuario,
        specialty: medico?.especialidadNombre,
      }),
    );
  }
}
