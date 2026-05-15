/**
 * ============================================================================
 * ErrorDominio — Clase base para todos los errores del dominio
 * ============================================================================
 *
 * Cada error específico del dominio (DniInvalidoError, CitaFueraDeVentanaError,
 * etc.) debe heredar de esta clase y definir su `codigo` único.
 *
 * El `codigo` es la clave estable que usa el middleware HTTP para mapear
 * a respuestas (400/404/409/etc.) y mensajes amigables al cliente.
 * ============================================================================
 */

export abstract class ErrorDominio extends Error {
  abstract readonly codigo: string;

  /**
   * Estado HTTP sugerido para este error.
   * El errorHandler lo usa para responder. Default: 400 (Bad Request).
   */
  readonly httpStatus: number = 400;

  constructor(mensaje: string) {
    super(mensaje);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error genérico cuando un recurso no se encuentra.
 * Útil para casos triviales sin necesidad de declarar una subclase.
 */
export class RecursoNoEncontradoError extends ErrorDominio {
  readonly codigo = 'RECURSO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(recurso: string, id?: string) {
    super(id ? `${recurso} con id '${id}' no encontrado` : `${recurso} no encontrado`);
  }
}

/**
 * Error genérico cuando se intenta crear un recurso que viola unicidad.
 */
export class RecursoDuplicadoError extends ErrorDominio {
  readonly codigo = 'RECURSO_DUPLICADO';
  readonly httpStatus = 409;

  constructor(recurso: string, campo: string, valor: string) {
    super(`Ya existe un ${recurso} con ${campo}='${valor}'`);
  }
}

/**
 * Error de autorización: el usuario no tiene permiso para esta operación.
 */
export class NoAutorizadoError extends ErrorDominio {
  readonly codigo = 'NO_AUTORIZADO';
  readonly httpStatus = 403;

  constructor(mensaje = 'No autorizado para realizar esta operación') {
    super(mensaje);
  }
}
