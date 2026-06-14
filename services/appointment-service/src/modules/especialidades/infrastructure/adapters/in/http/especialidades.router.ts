import { Router } from 'express';
import { requireRole } from '@clinica-x/shared-middleware';
import type { EspecialidadesController } from './especialidades.controller';

export function createEspecialidadesRouter(
  controller: EspecialidadesController,
): Router {
  const router = Router();

  router.use(requireRole(['ADMIN']));

  router.get('/', controller.listar);
  router.post('/', controller.crear);
  router.put('/:id', controller.actualizar);
  router.patch('/:id/status', controller.cambiarEstado);

  return router;
}