/**
 * ============================================================================
 * Password — Value Object
 * ============================================================================
 * Valida que la contraseña en texto plano cumpla con las reglas de seguridad.
 * NO almacena el hash — eso lo hace el adaptador de hash.
 * ============================================================================
 */
import { Result, Ok, Err, ValueObjectBase } from '@clinica-x/shared-kernel';

export class Password extends ValueObjectBase<string> {
  static readonly LONGITUD_MINIMA = 8;

  private constructor(valor: string) {
    super(valor);
  }

  static create(valor: string): Result<Password, Error> {
    if (valor.length < Password.LONGITUD_MINIMA) {
      return Err(
        new Error(`La contraseña debe tener al menos ${Password.LONGITUD_MINIMA} caracteres`),
      );
    }
    return Ok(new Password(valor));
  }
}
