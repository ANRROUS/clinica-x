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

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Error de dominio (ya tipado)
  if (err instanceof ErrorDominio) {
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

  // Error inesperado: loguear y devolver 500 genérico
  // eslint-disable-next-line no-console
  console.error('[errorHandler] Error inesperado:', err);

  res.status(500).json({
    success: false,
    error: {
      codigo: 'ERROR_INTERNO',
      mensaje: 'Ocurrió un error inesperado en el servidor',
    },
  });
};
