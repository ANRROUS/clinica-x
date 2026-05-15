/**
 * ============================================================================
 * Dni — Value Object
 * ============================================================================
 * Valida que el DNI tenga exactamente 8 dígitos numéricos.
 * ============================================================================
 */
import { Result, Ok, Err, ValueObjectBase } from '@clinica-x/shared-kernel';

export class Dni extends ValueObjectBase<string> {
  static readonly LONGITUD = 8;

  private constructor(valor: string) {
    super(valor);
  }

  static create(valor: string): Result<Dni, Error> {
    const limpio = valor.trim();
    if (!/^\d{8}$/.test(limpio)) {
      return Err(new Error(`El DNI debe tener exactamente ${Dni.LONGITUD} dígitos numéricos`));
    }
    return Ok(new Dni(limpio));
  }
}
