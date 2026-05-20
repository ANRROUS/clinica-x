/**
 * ============================================================================
 * Ports de entrada (contratos de use cases) — módulo consultas
 * ============================================================================
 */

import type { Result } from '@clinica-x/shared-kernel';
import type { EstadoConsulta } from '@clinica-x/shared-types';

// ─── DTOs de entrada ─────────────────────────────────────────────────────────

export interface IniciarConsultaDto {
  pacienteId: string;
  medicoId: string;
  citaId?: string;
  motivoConsulta?: string;
}

export interface FinalizarConsultaDto {
  diagnostico?: string;
  notas?: string;
}

export interface ListarConsultasDto {
  pacienteId?: string;
  medicoId?: string;
  estado?: EstadoConsulta;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

// ─── DTOs de salida ─────────────────────────────────────────────────────────

export interface ConsultaDto {
  id: string;
  pacienteId: string;
  medicoId: string;
  citaId: string | null;
  estado: EstadoConsulta;
  motivoConsulta: string | null;
  diagnostico: string | null;
  notas: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  pacienteNombre?: string;
  pacienteApellido?: string;
  pacienteDni?: string;
  pacienteEmail?: string;
  pacienteTelefono?: string;
  analysisOrders?: { examName: string; specialty?: string }[];
  medications?: { name: string; days: number; frequency: string }[];
}

export interface PacienteDetalleDto {
  patient: {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono?: string;
  };
  consultations: ConsultaDto[];
}

// ─── Contratos de use cases ─────────────────────────────────────────────────

export interface IIniciarConsultaPort {
  execute(dto: IniciarConsultaDto): Promise<Result<ConsultaDto, Error>>;
}

export interface IFinalizarConsultaPort {
  execute(consultaId: string, dto: FinalizarConsultaDto): Promise<Result<ConsultaDto, Error>>;
}

export interface IObtenerConsultaPort {
  execute(consultaId: string): Promise<Result<ConsultaDto, Error>>;
}

export interface IListarConsultasPacientePort {
  execute(dto: ListarConsultasDto): Promise<Result<ConsultaDto[], Error>>;
}

export interface IListarConsultasMedicoPort {
  execute(dto: ListarConsultasDto): Promise<Result<ConsultaDto[], Error>>;
}

export interface IObtenerPacienteDetallePort {
  execute(medicoId: string, pacienteId: string): Promise<Result<PacienteDetalleDto, Error>>;
}
