/**
 * ============================================================================
 * Entidad Cita — Aggregate Root del módulo de citas
 * ============================================================================
 * Representa una reserva de cita médica.
 * ============================================================================
 */

import { EntidadBase, Result, Ok, Err } from '@clinica-x/shared-kernel';
import type { EstadoCita, TipoReserva } from '@clinica-x/shared-types';

export interface CitaProps {
  pacienteId: string;
  medicoId: string;
  fechaHora: Date;
  estado?: EstadoCita;
  tipoReserva?: TipoReserva;
  motivo?: string;
}

export class Cita extends EntidadBase<string> {
  private _pacienteId: string;
  private _medicoId: string;
  private _fechaHora: Date;
  private _estado: EstadoCita;
  private _tipoReserva: TipoReserva;
  private _motivo: string | undefined;

  private constructor(id: string, props: CitaProps) {
    super(id);
    this._pacienteId = props.pacienteId;
    this._medicoId = props.medicoId;
    this._fechaHora = props.fechaHora;
    this._estado = props.estado ?? 'CONFIRMADA';
    this._tipoReserva = props.tipoReserva ?? 'MANUAL';
    this._motivo = props.motivo;
  }

  static create(id: string, props: CitaProps): Result<Cita, Error> {
    if (!props.pacienteId || props.pacienteId.trim().length === 0) {
      return Err(new Error('El pacienteId es requerido'));
    }
    if (!props.medicoId || props.medicoId.trim().length === 0) {
      return Err(new Error('El medicoId es requerido'));
    }
    if (!(props.fechaHora instanceof Date) || isNaN(props.fechaHora.getTime())) {
      return Err(new Error('La fechaHora debe ser una fecha válida'));
    }
    return Ok(new Cita(id, props));
  }

  // ─── Getters ──────────────────────────────────────────────────────────────
  get pacienteId(): string { return this._pacienteId; }
  get medicoId(): string { return this._medicoId; }
  get fechaHora(): Date { return this._fechaHora; }
  get estado(): EstadoCita { return this._estado; }
  get tipoReserva(): TipoReserva { return this._tipoReserva; }
  get motivo(): string | undefined { return this._motivo; }

  // ─── Métodos de negocio ───────────────────────────────────────────────────
  cancelar(): void {
    this._estado = 'CANCELADA';
  }

  reprogramar(nuevaFechaHora: Date): void {
    this._fechaHora = nuevaFechaHora;
  }

  iniciarAtencion(): void {
    this._estado = 'EN_ATENCION';
  }

  completar(): void {
    this._estado = 'COMPLETADA';
  }

  esPropietario(pacienteId: string): boolean {
    return this._pacienteId === pacienteId;
  }

  puedeCancelarOReprogramar(ahora: Date): boolean {
    const diffMs = this._fechaHora.getTime() - ahora.getTime();
    const unaHoraMs = 60 * 60 * 1000;
    return diffMs > unaHoraMs;
  }
}
