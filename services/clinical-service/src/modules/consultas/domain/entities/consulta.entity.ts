/**
 * ============================================================================
 * Entidad Consulta — Aggregate Root del módulo clínico
 * ============================================================================
 */

import { EntidadBase, Result, Ok, Err } from '@clinica-x/shared-kernel';
import type { EstadoConsulta } from '@clinica-x/shared-types';

export interface ConsultaProps {
  pacienteId: string;
  medicoId: string;
  citaId?: string;
  estado?: EstadoConsulta;
  motivoConsulta?: string;
  diagnostico?: string;
  notas?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export class Consulta extends EntidadBase<string> {
  private _pacienteId: string;
  private _medicoId: string;
  private _citaId: string | undefined;
  private _estado: EstadoConsulta;
  private _motivoConsulta: string | undefined;
  private _diagnostico: string | undefined;
  private _notas: string | undefined;
  private _fechaInicio: Date;
  private _fechaFin: Date | undefined;

  private constructor(id: string, props: ConsultaProps) {
    super(id);
    this._pacienteId = props.pacienteId;
    this._medicoId = props.medicoId;
    this._citaId = props.citaId;
    this._estado = props.estado ?? 'ACTIVA';
    this._motivoConsulta = props.motivoConsulta;
    this._diagnostico = props.diagnostico;
    this._notas = props.notas;
    this._fechaInicio = props.fechaInicio ?? new Date();
    this._fechaFin = props.fechaFin;
  }

  static create(id: string, props: ConsultaProps): Result<Consulta, Error> {
    if (!props.pacienteId || props.pacienteId.trim().length === 0) {
      return Err(new Error('El pacienteId es requerido'));
    }
    if (!props.medicoId || props.medicoId.trim().length === 0) {
      return Err(new Error('El medicoId es requerido'));
    }
    return Ok(new Consulta(id, props));
  }

  // ─── Getters ──────────────────────────────────────────────────────────────
  get pacienteId(): string { return this._pacienteId; }
  get medicoId(): string { return this._medicoId; }
  get citaId(): string | undefined { return this._citaId; }
  get estado(): EstadoConsulta { return this._estado; }
  get motivoConsulta(): string | undefined { return this._motivoConsulta; }
  get diagnostico(): string | undefined { return this._diagnostico; }
  get notas(): string | undefined { return this._notas; }
  get fechaInicio(): Date { return this._fechaInicio; }
  get fechaFin(): Date | undefined { return this._fechaFin; }

  // ─── Métodos de negocio ───────────────────────────────────────────────────
  finalizar(diagnostico?: string, notas?: string): void {
    this._estado = 'FINALIZADA';
    this._fechaFin = new Date();
    if (diagnostico) this._diagnostico = diagnostico;
    if (notas) this._notas = notas;
  }

  esDelMedico(medicoId: string): boolean {
    return this._medicoId === medicoId;
  }

  esDelPaciente(pacienteId: string): boolean {
    return this._pacienteId === pacienteId;
  }
}
