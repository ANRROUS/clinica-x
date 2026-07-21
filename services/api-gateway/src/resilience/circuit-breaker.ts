/**
 * ============================================================================
 * Circuit Breaker — Patrón de resiliencia ISO 25010 (Tolerancia a Fallos)
 * ============================================================================
 * Implementa la máquina de estados CLOSED → OPEN → HALF_OPEN por microservicio.
 *
 * CLOSED   : operación normal, peticiones fluyen libremente.
 * OPEN     : circuito abierto tras superar failureThreshold; responde 503
 *            inmediatamente sin reenviar al upstream.
 * HALF_OPEN: tras `recoveryTimeout` ms, deja pasar successThreshold peticiones
 *            de prueba. Si todas tienen éxito, cierra el circuito; si falla
 *            alguna, lo abre de nuevo.
 * ============================================================================
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  /** Número de fallos consecutivos para abrir el circuito. Default: 5 */
  failureThreshold: number;
  /** Éxitos consecutivos en HALF_OPEN para volver a CLOSED. Default: 2 */
  successThreshold: number;
  /** Milisegundos en OPEN antes de pasar a HALF_OPEN. Default: 30 000 */
  recoveryTimeout: number;
}

interface CircuitStats {
  state: CircuitState;
  failures: number;
  successes: number;
  openedAt: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  recoveryTimeout: 30_000,
};

const circuits = new Map<string, CircuitStats>();

function getCircuit(service: string): CircuitStats {
  if (!circuits.has(service)) {
    circuits.set(service, { state: 'CLOSED', failures: 0, successes: 0, openedAt: 0 });
  }
  return circuits.get(service)!;
}

/**
 * Retorna true si el circuito está abierto y la petición debe ser rechazada.
 * Transiciona OPEN → HALF_OPEN automáticamente cuando expira recoveryTimeout.
 */
export function isCircuitOpen(
  service: string,
  config: CircuitBreakerConfig = DEFAULT_CONFIG,
): boolean {
  const cb = getCircuit(service);

  if (cb.state === 'CLOSED') return false;

  if (cb.state === 'OPEN') {
    if (Date.now() - cb.openedAt >= config.recoveryTimeout) {
      cb.state = 'HALF_OPEN';
      cb.successes = 0;
      return false;
    }
    return true;
  }

  // HALF_OPEN: permite pasar una petición de prueba
  return false;
}

/** Registra un éxito. En HALF_OPEN, puede cerrar el circuito. */
export function recordSuccess(
  service: string,
  config: CircuitBreakerConfig = DEFAULT_CONFIG,
): void {
  const cb = getCircuit(service);
  if (cb.state === 'HALF_OPEN') {
    cb.successes++;
    if (cb.successes >= config.successThreshold) {
      cb.state = 'CLOSED';
      cb.failures = 0;
      cb.successes = 0;
    }
  } else if (cb.state === 'CLOSED') {
    cb.failures = 0;
  }
}

/** Registra un fallo. Puede abrir el circuito si supera failureThreshold. */
export function recordFailure(
  service: string,
  config: CircuitBreakerConfig = DEFAULT_CONFIG,
): void {
  const cb = getCircuit(service);
  cb.failures++;

  if (cb.state === 'HALF_OPEN' || cb.failures >= config.failureThreshold) {
    cb.state = 'OPEN';
    cb.openedAt = Date.now();
    cb.failures = 0;
    cb.successes = 0;
  }
}

/** Retorna el estado actual de todos los circuitos (para /health). */
export function getAllCircuitStates(): Record<string, CircuitState> {
  const result: Record<string, CircuitState> = {};
  for (const [service, stats] of circuits) {
    result[service] = stats.state;
  }
  return result;
}
