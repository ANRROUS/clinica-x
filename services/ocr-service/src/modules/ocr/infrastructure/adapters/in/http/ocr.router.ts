import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { OcrController } from './ocr.controller';
import { env } from '@/env';

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

export function createOcrRouter(controller: OcrController): Router {
  const router = Router();

  router.post('/process', requireInternalApiKey, controller.procesar);
  router.get('/results/:archivoId', controller.obtenerPorArchivo);
  router.get('/results/order/:ordenAnalisisId', controller.obtenerPorOrden);
  router.get('/results/paciente/:pacienteId', controller.listarPorPaciente);
  router.get('/status/:archivoId', controller.status);

  return router;
}
