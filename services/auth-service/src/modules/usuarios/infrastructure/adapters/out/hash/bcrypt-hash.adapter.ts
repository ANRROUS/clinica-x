/**
 * ============================================================================
 * BcryptHashAdapter — Implementación del puerto IHashService
 * ============================================================================
 * Usa bcrypt para hashear y comparar contraseñas.
 * ============================================================================
 */

import bcrypt from 'bcryptjs';
import type { IHashService } from '@/modules/usuarios/domain/ports/out/usuario.repository.port';

export class BcryptHashAdapter implements IHashService {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparar(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}