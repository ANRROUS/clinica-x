/**
 * ============================================================================
 * Puertos de salida del dominio de médicos
 * ============================================================================
 * Contratos que el dominio espera que la infraestructura implemente.
 * ============================================================================
 */

import type { Medico } from '../../entities/medico.entity';
import type { HorarioMedico } from '../../value-objects/horario-medico.vo';

export interface IMedicoRepository {
  /** Guarda un médico nuevo (sin horarios). */
  guardar(medico: Medico): Promise<void>;

  /** Busca por id incluyendo horarios y especialidad. */
  buscarPorId(id: string): Promise<(Medico & { horarios: HorarioMedico[]; especialidadNombre: string }) | null>;

  /** Busca por nombre de usuario. */
  buscarPorNombreUsuario(nombreUsuario: string): Promise<Medico | null>;

  /** Busca por usuarioId (referencia a auth-service). */
  buscarPorUsuarioId(usuarioId: string): Promise<Medico | null>;

  /** Lista todos los médicos con horarios y especialidad. */
  listarTodos(): Promise<(Medico & { horarios: HorarioMedico[]; especialidadNombre: string })[]>;

  /** Actualiza datos del médico. */
  actualizar(medico: Medico): Promise<void>;

  /** Reemplaza todos los horarios de un médico. */
  reemplazarHorarios(medicoId: string, horarios: HorarioMedico[]): Promise<void>;

  /** Elimina un médico y sus horarios en cascada. */
  eliminar(medicoId: string): Promise<void>;
}

/**
 * Puerto para comunicación cross-service con auth-service.
 * El appointment-service llama a auth-service para crear/actualizar
 * el usuario asociado a un médico.
 */
export interface IAuthServiceClient {
  /** Crea un usuario con rol MEDICO en auth-service. Retorna el usuarioId. */
  crearUsuarioMedico(dto: {
    dni: string;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
  }): Promise<{ id: string }>;

  /** Actualiza los datos personales de un usuario en auth-service. */
  actualizarUsuario(usuarioId: string, dto: {
    nombre?: string;
    apellido?: string;
    dni?: string;
    email?: string;
    telefono?: string;
    password?: string;
  }): Promise<void>;
}
