/**
 * ============================================================================
 * EntidadBase<TId> — Clase base para entidades del dominio
 * ============================================================================
 *
 * Las entidades tienen IDENTIDAD propia (un id único) que las distingue
 * de otras entidades, aunque sus atributos sean idénticos.
 *
 * Esta clase base provee:
 * - Almacenamiento del id (inmutable)
 * - Comparación por identidad (equals)
 * - No expone constructor público — las subclases deben usar factory methods
 *
 * Las subclases concretas (Usuario, Medico, Cita, Consulta) deben:
 * - Tener constructor privado
 * - Exponer un factory `create()` que retorne Result<Entidad, Error>
 * - Mutar estado solo a través de métodos de negocio
 * - Publicar eventos de dominio en su lista interna
 * ============================================================================
 */

export abstract class EntidadBase<TId> {
  protected readonly _id: TId;

  protected constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  equals(otro?: EntidadBase<TId>): boolean {
    if (otro === null || otro === undefined) return false;
    if (otro === this) return true;
    if (!(otro instanceof EntidadBase)) return false;
    return this._id === otro._id;
  }
}
