/**
 * ============================================================================
 * Result<T, E> — Tipo de retorno explícito para operaciones que pueden fallar
 * ============================================================================
 *
 * ¿QUÉ ES?
 * Una unión discriminada que representa el resultado de una operación:
 *   - `Ok(value)`  → éxito con un valor de tipo T
 *   - `Err(error)` → fallo con un error de tipo E
 *
 * ¿POR QUÉ USARLO EN VEZ DE THROW?
 * - Hace explícitos los errores en la firma de las funciones
 * - Obliga al consumidor a manejarlos (TypeScript reclama si no se chequea isErr)
 * - Evita try/catch encadenados y stack-traces difíciles
 * - Es funcional, sin efectos secundarios de excepciones
 *
 * USO:
 *   const r = NombreMarca.create("Coca");
 *   if (r.isErr) return Err(r.error);
 *   const nombre = r.value;
 * ============================================================================
 */

export type Result<T, E = Error> =
  | { readonly isOk: true; readonly isErr: false; readonly value: T }
  | { readonly isOk: false; readonly isErr: true; readonly error: E };

export function Ok(): Result<void, never>;
export function Ok<T>(value: T): Result<T, never>;
export function Ok<T>(value?: T): Result<T | void, never> {
  return {
    isOk: true,
    isErr: false,
    value: value as T,
  };
}

export function Err<E>(error: E): Result<never, E> {
  return {
    isOk: false,
    isErr: true,
    error,
  };
}
