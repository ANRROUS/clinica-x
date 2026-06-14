import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { OcrController } from './ocr.controller';
import { env } from '@/env';
import { requireRole } from '@clinica-x/shared-middleware';

function requireInternalApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-internal-api-key'];
  if (!apiKey || apiKey !== env.INTERNAL_API_KEY) {
    res.status(403).json({
      success: false,
      error: { codigo: 'FORBIDDEN', mensaje: 'Acceso denegado. Se requiere API key interna.' },
    });
    return;
  }
  next();
}

function verifyOwnership(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({
      success: false,
      error: { codigo: 'NO_AUTENTICADO', mensaje: 'Debes iniciar sesión' },
    });
    return;
  }
  if (user.rol === 'MEDICO' || user.rol === 'ADMIN') {
    return next();
  }
  const requestedPacienteId = req.params.pacienteId;
  if (requestedPacienteId && requestedPacienteId !== user.sub) {
    res.status(403).json({
      success: false,
      error: { codigo: 'ROL_INSUFICIENTE', mensaje: 'No puedes acceder a resultados de otro paciente' },
    });
    return;
  }
  next();
}

export function createOcrRouter(controller: OcrController): Router {
  const router = Router();

  router.post('/process', requireInternalApiKey, controller.procesar);
  router.post('/admin/process', requireRole(['ADMIN']), controller.procesarAdmin);
  router.get('/results/:archivoId', requireRole(['PACIENTE', 'MEDICO', 'ADMIN']), controller.obtenerPorArchivo);
  router.get('/results/order/:ordenAnalisisId', requireRole(['PACIENTE', 'MEDICO', 'ADMIN']), controller.obtenerPorOrden);
  router.get('/results/paciente/:pacienteId', requireRole(['PACIENTE', 'MEDICO', 'ADMIN']), verifyOwnership, controller.listarPorPaciente);
  router.get('/status/:archivoId', requireRole(['PACIENTE', 'MEDICO', 'ADMIN']), controller.status);

  return router;
}
