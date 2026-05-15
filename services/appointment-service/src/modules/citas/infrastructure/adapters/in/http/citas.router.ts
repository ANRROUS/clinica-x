/**
 * ============================================================================
 * Router del módulo de citas (booking + calendario)
 * ============================================================================
 * Rutas bajo /api/appointments
 * ============================================================================
 */

import { Router } from 'express';
import { requireRole } from '@clinica-x/shared-middleware';
import type { CitasController } from './citas.controller';

export function createCitasRouter(controller: CitasController): Router {
  const router = Router();

  // ─── Paciente ─────────────────────────────────────────────────────────────
  router.get('/availability', requireRole(['PACIENTE']), controller.disponibilidad);
  router.get('/availability/specialty/:especialidadId', requireRole(['PACIENTE']), controller.disponibilidadPorEspecialidad);
  router.post('/book/manual', requireRole(['PACIENTE']), controller.reservarManual);
  router.post('/book/automatic', requireRole(['PACIENTE']), controller.reservarAutomatica);
  router.get('/patient/me', requireRole(['PACIENTE']), controller.listarPaciente);
  router.put('/patient/:id', requireRole(['PACIENTE']), controller.reprogramar);
  router.delete('/patient/:id', requireRole(['PACIENTE']), controller.cancelar);

  // ─── Médico ───────────────────────────────────────────────────────────────
  router.get('/doctor/calendar', requireRole(['MEDICO']), controller.calendarioMedico);
  router.patch('/doctor/:id/status', requireRole(['MEDICO']), controller.cambiarEstado);

  return router;
}
