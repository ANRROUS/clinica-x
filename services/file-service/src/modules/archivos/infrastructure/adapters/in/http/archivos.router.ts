/**
 * ============================================================================
 * Router del módulo de archivos
 * ============================================================================
 * Rutas bajo /api/files
 * ============================================================================
 */

import { Router } from 'express';
import multer from 'multer';
import type { ArchivosController } from './archivos.controller';

const upload = multer({ storage: multer.memoryStorage() });

export function createArchivosRouter(controller: ArchivosController): Router {
  const router = Router();

  router.post('/upload', upload.single('file'), controller.upload);
  router.get('/:id/signed-url', controller.signedUrl);
  router.delete('/:id', controller.delete);

  return router;
}
