/**
 * ============================================================================
 * Puertos de entrada del dominio de médicos
 * ============================================================================
 * Contratos públicos que los adaptadores de entrada (controladores HTTP)
 * invocan. Cada caso de uso implementa uno de estos puertos.
 * ============================================================================
 */

import type { Result } from '@clinica-x/shared-kernel';
import type { Turno } from '@clinica-x/shared-types';

// ─── Horario DTO ────────────────────────────────────────────────────────────
export interface HorarioMedicoDto {
  diaSemana: number; // 1-7
  horaInicio: string; // "08:00"
  horaFin: string;    // "08:30"
}

// ─── DTOs de entrada ────────────────────────────────────────────────────────
export interface CrearMedicoDto {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  username: string;
  specialtyId: string;
  shift: Turno;
  password: string;
  schedules: HorarioMedicoDto[];
}

export interface ActualizarMedicoDto {
  nombre?: string;
  apellido?: string;
  dni?: string;
  email?: string;
  telefono?: string;
  username?: string;
  specialtyId?: string;
  shift?: Turno;
  password?: string;
  schedules?: HorarioMedicoDto[];
}

export interface CambiarEstadoMedicoDto {
  activo: boolean;
}

// ─── DTOs de salida ─────────────────────────────────────────────────────────
export interface MedicoResponseDto {
  id: string;
  usuarioId: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  username: string;
  specialty: string;
  specialtyId: string;
  shift: Turno;
  activo: boolean;
  schedules: HorarioMedicoResponseDto[];
}

export interface HorarioMedicoResponseDto {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  duracionSlot: number;
}

export interface MetricasDashboardDto {
  totalDoctors: number;
  activeDoctors: number;
  inactiveDoctors: number;
  totalSpecialties: number;
}

// ─── Puertos de entrada (contratos de casos de uso) ─────────────────────────

export interface ICrearMedicoPort {
  execute(dto: CrearMedicoDto): Promise<Result<MedicoResponseDto, Error>>;
}

export interface IActualizarMedicoPort {
  execute(medicoId: string, dto: ActualizarMedicoDto): Promise<Result<MedicoResponseDto, Error>>;
}

export interface IListarMedicosPort {
  execute(): Promise<Result<MedicoResponseDto[], Error>>;
}

export interface IObtenerMedicoPort {
  execute(medicoId: string): Promise<Result<MedicoResponseDto, Error>>;
}

export interface ICambiarEstadoMedicoPort {
  execute(medicoId: string, dto: CambiarEstadoMedicoDto): Promise<Result<{ id: string; activo: boolean }, Error>>;
}

export interface IObtenerMetricasDashboardPort {
  execute(): Promise<Result<MetricasDashboardDto, Error>>;
}
