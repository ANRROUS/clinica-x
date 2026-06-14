/**
 * ============================================================================
 * Router del módulo de archivos
 * ============================================================================
 * Rutas bajo /api/files
 * ============================================================================
 */

import { Router } from 'express';
import multer from 'multer';
import { requireRole } from '@clinica-x/shared-middleware';
import type { ArchivosController } from './archivos.controller';

const upload = multer({ storage: multer.memoryStorage() });

export function createArchivosRouter(controller: ArchivosController): Router {
  const router = Router();

  router.post('/upload', requireRole(['PACIENTE', 'MEDICO', 'ADMIN']), upload.single('file'), controller.upload);
  router.get('/:id/signed-url', requireRole(['PACIENTE', 'MEDICO', 'ADMIN']), controller.signedUrl);
  router.delete('/:id', requireRole(['ADMIN']), controller.delete);

  return router;
}
