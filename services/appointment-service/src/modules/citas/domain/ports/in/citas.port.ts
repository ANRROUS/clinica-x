/**
 * ============================================================================
 * Puertos de entrada del dominio de citas
 * ============================================================================
 * Contratos públicos que los adaptadores de entrada (controladores HTTP)
 * invocan. Cada caso de uso implementa uno de estos puertos.
 * ============================================================================
 */

import type { Result } from '@clinica-x/shared-kernel';
import type { EstadoCita, TipoReserva } from '@clinica-x/shared-types';

// ─── DTOs de entrada ────────────────────────────────────────────────────────
export interface CrearCitaDto {
  pacienteId: string;
  medicoId: string;
  fechaHora: Date;
  tipoReserva: TipoReserva;
  motivo?: string;
}

export interface CancelarCitaDto {
  pacienteId: string;
}

export interface ReprogramarCitaDto {
  pacienteId: string;
  nuevaFechaHora: Date;
}

export interface ListarCitasPacienteDto {
  pacienteId: string;
}

export interface ListarCitasMedicoDto {
  medicoId: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface ObtenerDisponibilidadDto {
  medicoId: string;
  fecha: Date;
}

export interface ObtenerDisponibilidadPorEspecialidadDto {
  especialidadId: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface CambiarEstadoCitaDto {
  estado: EstadoCita;
  medicoId?: string;
}

// ─── DTOs de salida ─────────────────────────────────────────────────────────
export interface CitaResponseDto {
  id: string;
  pacienteId: string;
  medicoId: string;
  doctorName?: string;
  specialty?: string;
  fechaHora: string; // ISO
  estado: EstadoCita;
  tipoReserva: TipoReserva;
  motivo?: string;
  voucherCode?: string;
  pacienteNombre?: string;
  pacienteApellido?: string;
}

export interface SlotDto {
  horaInicio: string; // "08:00"
  horaFin: string;   // "08:30"
  disponible: boolean;
}

export interface DisponibilidadDiaDto {
  fecha: string; // ISO date
  slots: SlotDto[];
}

export interface DisponibilidadDoctorDto {
  doctorId: string;
  doctorName: string;
  specialty: string;
  dias: DisponibilidadDiaDto[];
}

// ─── Puertos de entrada (contratos de casos de uso) ─────────────────────────

export interface ICrearCitaPort {
  execute(dto: CrearCitaDto): Promise<Result<CitaResponseDto, Error>>;
}

export interface ICancelarCitaPort {
  execute(citaId: string, dto: CancelarCitaDto): Promise<Result<{ id: string; estado: EstadoCita }, Error>>;
}

export interface IReprogramarCitaPort {
  execute(citaId: string, dto: ReprogramarCitaDto): Promise<Result<CitaResponseDto, Error>>;
}

export interface IListarCitasPacientePort {
  execute(dto: ListarCitasPacienteDto): Promise<Result<CitaResponseDto[], Error>>;
}

export interface IListarCitasMedicoPort {
  execute(dto: ListarCitasMedicoDto): Promise<Result<CitaResponseDto[], Error>>;
}

export interface IObtenerDisponibilidadPort {
  execute(dto: ObtenerDisponibilidadDto): Promise<Result<SlotDto[], Error>>;
}

export interface IObtenerDisponibilidadPorEspecialidadPort {
  execute(dto: ObtenerDisponibilidadPorEspecialidadDto): Promise<Result<DisponibilidadDoctorDto[], Error>>;
}

export interface ICambiarEstadoCitaPort {
  execute(citaId: string, dto: CambiarEstadoCitaDto): Promise<Result<CitaResponseDto, Error>>;
}
