/**
 * ============================================================================
 * @clinica-x/shared-kernel — Punto de entrada del paquete
 * ============================================================================
 *
 * Re-exporta las primitivas compartidas que todo el dominio de los microservicios
 * consume: `Result<T,E>`, error base de dominio, y bases para entidades y VOs.
 *
 * Convención: solo se exportan tipos / clases base. No hay lógica de negocio.
 * ============================================================================
 */

export * from './result';
export * from './error-dominio';
export * from './entidad-base';
export * from './value-object-base';
