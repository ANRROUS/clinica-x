/**
 * ============================================================================
 * jwtMiddleware — Verifica el JWT del header Authorization
 * ============================================================================
 *
 * Espera: `Authorization: Bearer <token>`
 * Si el token es válido: setea `req.user` con el payload.
 * Si falta o es inválido: responde 401.
 *
 * Uso típico:
 *   app.use('/api/admin', jwtMiddleware(process.env.JWT_SECRET!), adminRouter);
 *
 * Rutas públicas (login, register) deben montarse ANTES de este middleware.
 * ============================================================================
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayloadUsuario } from './types';

export interface JwtMiddlewareOptions {
  secret: string;
  /** Lista de rutas (relativas) a saltarse. Útil en el gateway. */
  skipPaths?: string[];
}

export function jwtMiddleware(options: JwtMiddlewareOptions): RequestHandler {
  const { secret, skipPaths = [] } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Saltar rutas públicas (ej: login, register, health)
    if (skipPaths.some((p) => req.path === p || req.path.startsWith(p))) {
      return next();
    }

    const authHeader = req.header('authorization') || req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          codigo: 'TOKEN_FALTANTE',
          mensaje: 'Token de autenticación faltante o mal formado',
        },
      });
      return;
    }

    const token = authHeader.substring(7).trim();

    try {
      const payload = jwt.verify(token, secret) as JwtPayloadUsuario;
      req.user = payload;
      next();
    } catch (err) {
      const mensaje =
        err instanceof jwt.TokenExpiredError ? 'Token expirado' : 'Token inválido';
      res.status(401).json({
        success: false,
        error: {
          codigo: 'TOKEN_INVALIDO',
          mensaje,
        },
      });
    }
  };
}
