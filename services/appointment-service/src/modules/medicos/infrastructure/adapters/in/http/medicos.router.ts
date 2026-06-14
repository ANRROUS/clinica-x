/**
 * ============================================================================
 * Router del módulo de médicos (admin)
 * ============================================================================
 * Rutas bajo /api/admin/doctors
 * ============================================================================
 */

import { Router } from 'express';
import { requireRole } from '@clinica-x/shared-middleware';
import type { MedicosController } from './medicos.controller';

export function createMedicosRouter(
  controller: MedicosController,
): Router {
  const router = Router();

  router.use(requireRole(['ADMIN']));

  router.get('/', controller.listar);
  router.post('/', controller.crear);
  router.get('/:id', controller.obtener);
  router.put('/:id', controller.actualizar);
  router.patch('/:id/status', controller.cambiarEstado);

  return router;
}
