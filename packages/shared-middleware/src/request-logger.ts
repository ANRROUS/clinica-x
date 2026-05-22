/**
 * ============================================================================
 * requestLogger — Middleware de logging para requests HTTP
 * ============================================================================
 *
 * Registra el inicio y fin de cada request HTTP con:
 *   - TraceId para correlación entre microservicios
 *   - RequestId del middleware existente
 *   - SpanId único para este segmento
 *   - Método, path, IP, User-Agent
 *   - Status code y duración al finalizar
 *
 * USO:
 *   app.use(requestIdMiddleware());
 *   app.use(requestLogger(logger, 'auth-service'));
 *
 * PROPAGACIÓN:
 *   - Lee X-Trace-Id del header entrante (o genera uno nuevo)
 *   - Propaga X-Trace-Id en la response
 *   - Los microservicios downstream deben propagar el header
 * ============================================================================
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { randomUUID } from 'crypto';
import type { Logger } from 'pino';
import type { TraceInfo } from '@clinica-x/shared-kernel';

declare global {
  namespace Express {
    interface Request {
      traceInfo?: TraceInfo;
    }
  }
}

export function requestLogger(logger: Logger, serviceName: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    const traceId = req.header('x-trace-id') || randomUUID();
    const requestId = req.requestId || randomUUID();
    const spanId = randomUUID();

    const traceInfo: TraceInfo = { traceId, spanId, requestId };
    req.traceInfo = traceInfo;

    logger.info({
      trace: traceInfo,
      http: {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      },
      msg: `→ ${req.method} ${req.path}`,
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      let level: 'info' | 'warn' | 'error' = 'info';
      if (statusCode >= 500) level = 'error';
      else if (statusCode >= 400) level = 'warn';

      logger[level]({
        trace: { traceId, requestId },
        http: {
          method: req.method,
          path: req.path,
          status: statusCode,
          durationMs: duration,
        },
        msg: `← ${req.method} ${req.path} ${statusCode} (${duration}ms)`,
      });
    });

    res.setHeader('X-Trace-Id', traceId);
    next();
  };
}
