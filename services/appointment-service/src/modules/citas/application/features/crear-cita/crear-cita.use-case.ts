/**
 * ============================================================================
 * Caso de uso: CrearCita
 * ============================================================================
 * Orquesta:
 *  1. Verificar que el médico existe y está activo
 *  2. Verificar que la fecha sea futura (> 4 horas)
 *  3. Verificar que el slot esté libre
 *  4. Crear entidad Cita
 *  5. Persistir
 *  6. Retornar DTO
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { Cita } from '@/modules/citas/domain/entities/cita.entity';
import {
  MedicoNoEncontradoError,
  MedicoInactivoError,
  SlotNoDisponibleError,
} from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  ICrearCitaPort,
  CrearCitaDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';
import { nowLima } from '@clinica-x/date-utils';

const CUATRO_HORAS_MS = 4 * 60 * 60 * 1000;

export class CrearCitaUseCase implements ICrearCitaPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: CrearCitaDto): Promise<Result<CitaResponseDto, Error>> {
    // 1. Verificar médico
    const medico = await this.medicoReader.buscarPorId(dto.medicoId);
    if (!medico) {
      return Err(new MedicoNoEncontradoError(dto.medicoId));
    }
    if (!medico.activo) {
      return Err(new MedicoInactivoError());
    }

    // 2. Verificar que la fecha sea futura (> 4 horas)
    const ahora = nowLima();
    const diffMs = dto.fechaHora.getTime() - ahora.getTime();
    if (diffMs < CUATRO_HORAS_MS) {
      return Err(new SlotNoDisponibleError('Debes reservar con al menos 4 horas de anticipación'));
    }

    // 3-5. Crear entidad y persistir atómicamente (verifica + guarda en transacción)
    const id = crypto.randomUUID();
    const citaResult = Cita.create(id, {
      pacienteId: dto.pacienteId,
      medicoId: dto.medicoId,
      fechaHora: dto.fechaHora,
      tipoReserva: dto.tipoReserva,
      motivo: dto.motivo,
    });
    if (citaResult.isErr) return Err(citaResult.error);

    const inicioRango = new Date(dto.fechaHora.getTime() - 1);
    const finRango = new Date(dto.fechaHora.getTime() + 30 * 60 * 1000);
    const guardada = await this.repo.guardarSiLibre(citaResult.value, inicioRango, finRango);
    if (!guardada) {
      return Err(new SlotNoDisponibleError());
    }

    // 6. Retornar DTO
    const voucherCode = `VCH-${id.slice(0, 8).toUpperCase()}`;
    return Ok(
      toCitaResponseDto(citaResult.value, {
        doctorName: medico.nombreUsuario,
        specialty: medico.especialidadNombre,
        voucherCode,
      }),
    );
  }
}
