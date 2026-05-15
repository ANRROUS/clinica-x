/**
 * ============================================================================
 * requestIdMiddleware — Genera o propaga un ID único por request
 * ============================================================================
 *
 * - Si el header X-Request-Id ya viene (ej: del gateway), lo usa
 * - Si no, genera un UUID v4
 * - Lo guarda en `req.requestId` y lo agrega a la response
 *
 * Útil para correlacionar logs entre múltiples microservicios.
 * ============================================================================
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { randomUUID } from 'crypto';

export function requestIdMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const incoming = req.header('x-request-id');
    const id = incoming && incoming.trim().length > 0 ? incoming.trim() : randomUUID();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
  };
}
