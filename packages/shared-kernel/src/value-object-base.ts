/**
 * ============================================================================
 * ValueObjectBase<T> — Clase base para Value Objects (VOs) del dominio
 * ============================================================================
 *
 * Un Value Object es un objeto INMUTABLE que se identifica por sus atributos,
 * no por una identidad. Ej: Email, Dni, NombreMarca, ScheduleCell.
 *
 * Reglas:
 * - Inmutable: una vez creado, no cambia (readonly)
 * - Validado en el factory `create()` (retorna Result)
 * - Igualdad estructural (mismo valor → mismo VO)
 * ============================================================================
 */

export abstract class ValueObjectBase<T> {
  protected readonly _value: T;

  protected constructor(value: T) {
    this._value = Object.freeze(value);
  }

  get value(): T {
    return this._value;
  }

  equals(otro?: ValueObjectBase<T>): boolean {
    if (otro === null || otro === undefined) return false;
    if (otro === this) return true;
    return JSON.stringify(this._value) === JSON.stringify(otro._value);
  }

  toString(): string {
    if (typeof this._value === 'string') return this._value;
    return JSON.stringify(this._value);
  }
}
