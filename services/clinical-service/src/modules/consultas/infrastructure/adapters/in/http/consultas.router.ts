/**
 * ============================================================================
 * Router del módulo de consultas
 * ============================================================================
 * Rutas bajo /api/medical
 * ============================================================================
 */

import { Router } from 'express';
import { requireRole } from '@clinica-x/shared-middleware';
import type { ConsultasController } from './consultas.controller';

export function createConsultasRouter(controller: ConsultasController): Router {
  const router = Router();

  // ─── Médico ───────────────────────────────────────────────────────────────
  router.post('/doctor/consultation/start', requireRole(['MEDICO']), controller.start);
  router.post('/doctor/consultation/:id/finalize', requireRole(['MEDICO']), controller.finalize);
  router.get('/doctor/active-patient', requireRole(['MEDICO']), controller.activePatient);
  router.get('/doctor/patients', requireRole(['MEDICO']), controller.doctorPatients);
  router.get('/doctor/patients/:patientId', requireRole(['MEDICO']), controller.patientDetail);

  // ─── Paciente ─────────────────────────────────────────────────────────────
  router.get('/patient/history', requireRole(['PACIENTE']), controller.patientHistory);
  router.get('/patient/consultation/:id', requireRole(['PACIENTE']), controller.patientConsultation);

  return router;
}
