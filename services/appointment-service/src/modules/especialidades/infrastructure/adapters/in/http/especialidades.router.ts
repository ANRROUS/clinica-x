import { Router } from 'express';
import type { EspecialidadesController } from './especialidades.controller';

export function createEspecialidadesRouter(
  controller: EspecialidadesController,
): Router {
  const router = Router();

  router.get('/', controller.listar);
  router.post('/', controller.crear);
  router.put('/:id', controller.actualizar);
  router.patch('/:id/status', controller.cambiarEstado);

  return router;
}