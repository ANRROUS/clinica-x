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

const CUATRO_HORAS_MS = 4 * 60 * 60 * 1000;

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

    if (!cita.puedeCancelarOReprogramar(new Date())) {
      return Err(new NoSePuedeReprogramarError());
    }

    const ahora = new Date();
    const diffMs = dto.nuevaFechaHora.getTime() - ahora.getTime();
    if (diffMs < CUATRO_HORAS_MS) {
      return Err(new SlotNoDisponibleError('Debes reprogramar con al menos 4 horas de anticipación'));
    }

    // Verificar que el nuevo slot esté libre
    const inicioRango = new Date(dto.nuevaFechaHora.getTime() - 1);
    const finRango = new Date(dto.nuevaFechaHora.getTime() + 30 * 60 * 1000);
    const ocupadas = await this.repo.contarCitasEnRango(cita.medicoId, inicioRango, finRango);
    if (ocupadas > 0) {
      return Err(new SlotNoDisponibleError('El nuevo horario ya no está disponible'));
    }

    cita.reprogramar(dto.nuevaFechaHora);
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
