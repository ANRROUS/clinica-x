/**
 * ============================================================================
 * Retry con Exponential Backoff — Patrón de resiliencia ISO 25010
 * ============================================================================
 * Reintenta una operación asíncrona ante errores transitorios, esperando un
 * tiempo creciente entre intentos (backoff exponencial) para no saturar el
 * servicio en proceso de recuperación.
 *
 * Fórmula de espera:
 *   delay(attempt) = min(baseDelayMs × factor^(attempt-1), maxDelayMs)
 *
 * Con defaults: 200ms → 400ms → 800ms (máx 3 intentos)
 * ============================================================================
 */

export interface RetryConfig {
  /** Número máximo de intentos, incluyendo el primero. Default: 3 */
  maxAttempts: number;
  /** Espera base en ms antes del segundo intento. Default: 200 */
  baseDelayMs: number;
  /** Espera máxima entre intentos. Default: 5 000 */
  maxDelayMs: number;
  /** Factor multiplicador del backoff exponencial. Default: 2 */
  factor: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 200,
  maxDelayMs: 5_000,
  factor: 2,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Ejecuta `fn` con reintentos y backoff exponencial.
 *
 * - Si `fn` lanza, espera `delay` ms y vuelve a intentar.
 * - Si se agotan los intentos, propaga el último error.
 * - Si `fn` retorna un valor, lo devuelve inmediatamente sin más reintentos.
 *
 * Para errores de negocio (HTTP 4xx/5xx) que no deben reintentarse,
 * `fn` debe retornar un valor en lugar de lanzar una excepción.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < config.maxAttempts) {
        const delay = Math.min(
          config.baseDelayMs * Math.pow(config.factor, attempt - 1),
          config.maxDelayMs,
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}
