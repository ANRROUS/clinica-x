/**
 * ============================================================================
 * Entidad Usuario — Aggregate Root del módulo de autenticación
 * ============================================================================
 * Representa un usuario del sistema con sus datos de identidad y rol.
 * El passwordHash ya debe estar hasheado antes de llegar aquí.
 * ============================================================================
 */
import { EntidadBase, Result, Ok } from '@clinica-x/shared-kernel';
import type { Rol } from '@clinica-x/shared-types';
import { Dni } from '../value-objects/dni.vo';
import { Email } from '../value-objects/email.vo';

export interface UsuarioProps {
  dni: Dni;
  email: Email;
  passwordHash: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: Rol;
}

export class Usuario extends EntidadBase<string> {
  private _dni: Dni;
  private _email: Email;
  private _passwordHash: string;
  private _nombre: string;
  private _apellido: string;
  private _telefono?: string;
  private _rol: Rol;

  private constructor(id: string, props: UsuarioProps) {
    super(id);
    this._dni = props.dni;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._nombre = props.nombre;
    this._apellido = props.apellido;
    this._telefono = props.telefono;
    this._rol = props.rol;
  }

  static create(id: string, props: UsuarioProps): Result<Usuario, Error> {
    return Ok(new Usuario(id, props));
  }

  // ─── Getters ──────────────────────────────────────────────────────────────
  get dni(): Dni { return this._dni; }
  get email(): Email { return this._email; }
  get passwordHash(): string { return this._passwordHash; }
  get nombre(): string { return this._nombre; }
  get apellido(): string { return this._apellido; }
  get telefono(): string | undefined { return this._telefono; }
  get rol(): Rol { return this._rol; }
  get nombreCompleto(): string { return `${this._nombre} ${this._apellido}`; }

  // ─── Métodos de negocio ───────────────────────────────────────────────────
  actualizarPerfil(datos: Partial<Pick<UsuarioProps, 'nombre' | 'apellido' | 'telefono'>>): void {
    if (datos.nombre) this._nombre = datos.nombre;
    if (datos.apellido) this._apellido = datos.apellido;
    if (datos.telefono !== undefined) this._telefono = datos.telefono;
  }

  cambiarPasswordHash(nuevoHash: string): void {
    this._passwordHash = nuevoHash;
  }
}
