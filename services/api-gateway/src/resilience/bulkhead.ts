/**
 * ============================================================================
 * Bulkhead — Patrón de resiliencia ISO 25010 (Tolerancia a Fallos)
 * ============================================================================
 * Limita el número de peticiones concurrentes que pueden dirigirse a cada
 * microservicio. Si un upstream se satura o se vuelve lento, el pool de ese
 * servicio se llena pero los pools de los demás permanecen libres, evitando
 * que el colapso de uno consuma los recursos de toda la plataforma.
 *
 * Inspirado en los mamparos (bulkheads) de un barco: si un compartimento
 * toma agua, los demás permanecen estancos.
 * ============================================================================
 */

export interface BulkheadConfig {
  /** Máximo de peticiones simultáneas permitidas al upstream. Default: 50 */
  maxConcurrent: number;
}

const DEFAULT_BULKHEAD_CONFIG: BulkheadConfig = {
  // BULKHEAD_MAX permite sobrescribir el límite en pruebas sin tocar el código.
  maxConcurrent: process.env['BULKHEAD_MAX'] ? Number(process.env['BULKHEAD_MAX']) : 50,
};

/** Contador de peticiones en vuelo, indexado por nombre de servicio. */
const activeRequests = new Map<string, number>();

function getActive(service: string): number {
  return activeRequests.get(service) ?? 0;
}

/**
 * Retorna true si el pool del servicio está lleno.
 * La petición debe ser rechazada con 429 sin reenviar al upstream.
 */
export function isBulkheadFull(
  service: string,
  config: BulkheadConfig = DEFAULT_BULKHEAD_CONFIG,
): boolean {
  return getActive(service) >= config.maxConcurrent;
}

/** Incrementa el contador del servicio al aceptar una petición. */
export function acquireBulkhead(service: string): void {
  activeRequests.set(service, getActive(service) + 1);
}

/** Decrementa el contador del servicio cuando la petición finaliza. */
export function releaseBulkhead(service: string): void {
  activeRequests.set(service, Math.max(0, getActive(service) - 1));
}

/** Retorna el número de peticiones activas por servicio (expuesto en /health). */
export function getBulkheadStats(): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [service, count] of activeRequests) {
    result[service] = count;
  }
  return result;
}
