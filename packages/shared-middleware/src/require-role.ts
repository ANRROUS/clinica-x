/**
 * ============================================================================
 * requireRole — Restringe acceso a una ruta según el rol del usuario
 * ============================================================================
 *
 * Debe ejecutarse DESPUÉS de `jwtMiddleware` (necesita `req.user`).
 *
 * Uso:
 *   router.get('/dashboard', requireRole(['ADMIN']), controller.dashboard);
 *   router.get('/calendario', requireRole(['MEDICO']), controller.calendario);
 * ============================================================================
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Rol } from '@clinica-x/shared-types';

export function requireRole(rolesPermitidos: Rol[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.user;

    if (!usuario) {
      res.status(401).json({
        success: false,
        error: {
          codigo: 'NO_AUTENTICADO',
          mensaje: 'Debes iniciar sesión',
        },
      });
      return;
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      res.status(403).json({
        success: false,
        error: {
          codigo: 'ROL_INSUFICIENTE',
          mensaje: `Tu rol no tiene permisos para esta operación`,
        },
      });
      return;
    }

    next();
  };
}
