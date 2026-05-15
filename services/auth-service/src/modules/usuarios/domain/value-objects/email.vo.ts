/**
 * ============================================================================
 * Email — Value Object
 * ============================================================================
 * Valida formato de correo electrónico.
 * ============================================================================
 */
import { Result, Ok, Err, ValueObjectBase } from '@clinica-x/shared-kernel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email extends ValueObjectBase<string> {
  private constructor(valor: string) {
    super(valor);
  }

  static create(valor: string): Result<Email, Error> {
    const limpio = valor.trim().toLowerCase();
    if (!EMAIL_REGEX.test(limpio)) {
      return Err(new Error('El correo electrónico no tiene un formato válido'));
    }
    return Ok(new Email(limpio));
  }
}
