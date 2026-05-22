/**
 * ============================================================================
 * errorHandler — Middleware global de captura de errores
 * ============================================================================
 *
 * Convierte excepciones a respuestas HTTP estandarizadas:
 *   - ErrorDominio   → usa su `httpStatus` y `codigo`
 *   - ZodError       → 400 con detalle de campos
 *   - Otros          → 500 genérico
 *
 * Debe registrarse al FINAL de la cadena de middlewares:
 *   app.use(errorHandler);
 * ============================================================================
 */

import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ErrorDominio } from '@clinica-x/shared-kernel';
import pino from 'pino';

const errorLogger = pino({
  level: 'error',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  base: { service: process.env.SERVICE_NAME || 'unknown' },
});

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const trace = req.traceInfo;

  // Error de dominio (ya tipado)
  if (err instanceof ErrorDominio) {
    errorLogger.warn({
      trace,
      err: { name: err.name, codigo: err.codigo, message: err.message, httpStatus: err.httpStatus },
      http: { method: req.method, path: req.path },
      msg: `Error de dominio: ${err.codigo}`,
    });

    res.status(err.httpStatus).json({
      success: false,
      error: {
        codigo: err.codigo,
        mensaje: err.message,
      },
    });
    return;
  }

  // Error de validación Zod
  if (err instanceof ZodError) {
    errorLogger.warn({
      trace,
      err: { name: 'ZodError', message: 'Datos invalidos', details: err.errors },
      http: { method: req.method, path: req.path },
      msg: 'Error de validacion Zod',
    });

    res.status(400).json({
      success: false,
      error: {
        codigo: 'VALIDACION',
        mensaje: 'Datos inválidos',
        detalles: err.errors.map((e) => ({
          campo: e.path.join('.'),
          mensaje: e.message,
        })),
      },
    });
    return;
  }

  // Error inesperado
  errorLogger.error({
    trace,
    err: err instanceof Error ? err : { message: String(err) },
    http: { method: req.method, path: req.path },
    msg: 'Error inesperado en el servidor',
  });

  res.status(500).json({
    success: false,
    error: {
      codigo: 'ERROR_INTERNO',
      mensaje: 'Ocurrió un error inesperado en el servidor',
    },
  });
};
