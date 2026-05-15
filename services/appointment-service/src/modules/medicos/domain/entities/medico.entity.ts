/**
 * ============================================================================
 * Entidad Medico — Aggregate Root del módulo de médicos
 * ============================================================================
 * Representa un médico en el sistema de agendamiento.
 * No contiene datos personales (nombre, DNI, email); esos viven en auth-service.
 * Solo guarda datos profesionales: especialidad, turno, horarios, estado activo.
 * ============================================================================
 */

import { EntidadBase, Result, Ok } from '@clinica-x/shared-kernel';
import type { Turno } from '@clinica-x/shared-types';

export interface MedicoProps {
  usuarioId: string;
  nombreUsuario: string;
  especialidadId: string;
  turno: Turno;
  activo?: boolean;
}

export class Medico extends EntidadBase<string> {
  private _usuarioId: string;
  private _nombreUsuario: string;
  private _especialidadId: string;
  private _turno: Turno;
  private _activo: boolean;

  private constructor(id: string, props: MedicoProps) {
    super(id);
    this._usuarioId = props.usuarioId;
    this._nombreUsuario = props.nombreUsuario;
    this._especialidadId = props.especialidadId;
    this._turno = props.turno;
    this._activo = props.activo ?? true;
  }

  static create(id: string, props: MedicoProps): Result<Medico, Error> {
    return Ok(new Medico(id, props));
  }

  // ─── Getters ──────────────────────────────────────────────────────────────
  get usuarioId(): string { return this._usuarioId; }
  get nombreUsuario(): string { return this._nombreUsuario; }
  get especialidadId(): string { return this._especialidadId; }
  get turno(): Turno { return this._turno; }
  get activo(): boolean { return this._activo; }

  // ─── Métodos de negocio ───────────────────────────────────────────────────
  actualizarDatos(datos: Partial<Pick<MedicoProps, 'especialidadId' | 'turno' | 'nombreUsuario'>>): void {
    if (datos.especialidadId) this._especialidadId = datos.especialidadId;
    if (datos.turno) this._turno = datos.turno;
    if (datos.nombreUsuario) this._nombreUsuario = datos.nombreUsuario;
  }

  cambiarEstado(activo: boolean): void {
    this._activo = activo;
  }
}
