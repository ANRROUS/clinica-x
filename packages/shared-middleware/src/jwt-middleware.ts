/**
 * ============================================================================
 * jwtMiddleware — Verifica el JWT del header Authorization o cookie httpOnly
 * ============================================================================
 *
 * Prioridad:
 *  1. Header `Authorization: Bearer <token>`
 *  2. Cookie `auth_token` (httpOnly, seteada por auth-service en login)
 *
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

/**
 * Extrae el token desde el header Authorization o desde la cookie httpOnly.
 */
function extractToken(req: Request): string | null {
  // 1. Header Authorization
  const authHeader = req.header('authorization') || req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Cookie auth_token (httpOnly seteada por auth-service)
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [key, ...rest] = c.trim().split('=');
        return [key, decodeURIComponent(rest.join('='))];
      }),
    );
    const cookieToken = cookies['auth_token'];
    if (cookieToken) return cookieToken;
  }

  return null;
}

export function jwtMiddleware(options: JwtMiddlewareOptions): RequestHandler {
  const { secret, skipPaths = [] } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Saltar rutas públicas (ej: login, register, health)
    if (skipPaths.some((p) => req.path === p || req.path.startsWith(p))) {
      return next();
    }

    const token = extractToken(req);

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          codigo: 'TOKEN_FALTANTE',
          mensaje: 'Token de autenticación faltante o mal formado',
        },
      });
      return;
    }

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
