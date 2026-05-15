import type { Rol } from '@clinica-x/shared-types';

/**
 * Payload del JWT que viaja entre servicios y se materializa en `req.user`.
 */
export interface JwtPayloadUsuario {
  sub: string; // usuarioId
  rol: Rol;
  email: string;
  // Reservado para extender (doctorId, pacienteId si lo necesitamos)
  iat?: number;
  exp?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayloadUsuario;
      requestId?: string;
    }
  }
}

export {};
