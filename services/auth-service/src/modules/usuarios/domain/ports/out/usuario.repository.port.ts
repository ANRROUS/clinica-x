/**
 * ============================================================================
 * Puertos de salida del dominio de usuarios
 * ============================================================================
 * Son contratos que el dominio espera que la infraestructura implemente.
 * ============================================================================
 */

import type { Usuario } from '../../entities/usuario.entity';

export interface IUsuarioRepository {
  guardar(usuario: Usuario): Promise<void>;
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorIds(ids: string[]): Promise<Usuario[]>;
  buscarPorDni(dni: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorDniYEmail(dni: string, email: string): Promise<Usuario | null>;
  actualizar(usuario: Usuario): Promise<void>;
}

export interface IHashService {
  hash(password: string): Promise<string>;
  comparar(password: string, hash: string): Promise<boolean>;
}
