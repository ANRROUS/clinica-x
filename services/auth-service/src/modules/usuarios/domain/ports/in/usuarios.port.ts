/**
 * ============================================================================
 * Puertos de entrada del dominio de usuarios
 * ============================================================================
 * Son contratos públicos que los adaptadores de entrada (controladores HTTP)
 * invocan. Cada caso de uso implementa uno de estos puertos.
 * ============================================================================
 */

import type { Result } from '@clinica-x/shared-kernel';
import type { Usuario } from '../../entities/usuario.entity';

// ─── DTOs de entrada ────────────────────────────────────────────────────────

export interface CrearUsuarioDto {
  dni: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol?: 'PACIENTE' | 'MEDICO' | 'ADMIN';
}

export interface IniciarSesionDto {
  email: string;
  password: string;
  dni?: string;
}

export interface ActualizarPerfilDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
}

// ─── DTOs de salida ─────────────────────────────────────────────────────────

export interface UsuarioResponseDto {
  id: string;
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: string;
}

export interface SesionResponseDto {
  token: string;
  usuario: UsuarioResponseDto;
}

// ─── Puertos de entrada (contratos de casos de uso) ─────────────────────────

export interface ICrearUsuarioPort {
  execute(dto: CrearUsuarioDto): Promise<Result<SesionResponseDto, Error>>;
}

export interface IIniciarSesionPort {
  execute(dto: IniciarSesionDto): Promise<Result<SesionResponseDto, Error>>;
}

export interface IObtenerPerfilPort {
  execute(usuarioId: string): Promise<Result<UsuarioResponseDto, Error>>;
}

export interface IActualizarPerfilPort {
  execute(usuarioId: string, dto: ActualizarPerfilDto): Promise<Result<UsuarioResponseDto, Error>>;
}
