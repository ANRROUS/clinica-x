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

  /**
   * @swagger
   * /api/appointments/specialties:
   *   get:
   *     summary: Listar especialidades
   *     description: Obtiene las especialidades disponibles para reservar citas
   *     tags: [Citas]
   *     responses:
   *       200:
   *         description: Lista de especialidades
   */
  router.get('/specialties', requireRole(['PACIENTE', 'MEDICO']), controller.listarEspecialidades);

  /**
   * @swagger
   * /api/appointments/availability:
   *   get:
   *     summary: Obtener disponibilidad general
   *     description: Devuelve slots disponibles para reservar citas
   *     tags: [Citas - Paciente]
   *     responses:
   *       200:
   *         description: Disponibilidad obtenida
   */
  router.get('/availability', requireRole(['PACIENTE']), controller.disponibilidad);

  /**
   * @swagger
   * /api/appointments/availability/specialty/{especialidadId}:
   *   get:
   *     summary: Disponibilidad por especialidad
   *     description: Obtiene slots disponibles para una especialidad específica
   *     tags: [Citas - Paciente]
   *     parameters:
   *       - in: path
   *         name: especialidadId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Disponibilidad por especialidad
   */
  router.get('/availability/specialty/:especialidadId', requireRole(['PACIENTE']), controller.disponibilidadPorEspecialidad);

  /**
   * @swagger
   * /api/appointments/book/manual:
   *   post:
   *     summary: Reservar cita manualmente
   *     description: Paciente selecciona médico y horario específico
   *     tags: [Citas - Paciente]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [medicoId, horario]
   *             properties:
   *               medicoId:
   *                 type: string
   *               horario:
   *                 type: string
   *     responses:
   *       201:
   *         description: Cita reservada
   *       400:
   *         description: Horario no disponible
   */
  router.post('/book/manual', requireRole(['PACIENTE']), controller.reservarManual);

  /**
   * @swagger
   * /api/appointments/book/automatic:
   *   post:
   *     summary: Reservar cita automáticamente
   *     description: Sistema asigna el primer horario disponible
   *     tags: [Citas - Paciente]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [especialidadId]
   *             properties:
   *               especialidadId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Cita reservada automáticamente
   */
  router.post('/book/automatic', requireRole(['PACIENTE']), controller.reservarAutomatica);

  /**
   * @swagger
   * /api/appointments/patient/me:
   *   get:
   *     summary: Mis citas
   *     description: Obtiene todas las citas del paciente autenticado
   *     tags: [Citas - Paciente]
   *     responses:
   *       200:
   *         description: Lista de citas del paciente
   */
  router.get('/patient/me', requireRole(['PACIENTE']), controller.listarPaciente);

  /**
   * @swagger
   * /api/appointments/patient/{id}:
   *   put:
   *     summary: Reprogramar cita
   *     description: Cambia la fecha/hora de una cita existente
   *     tags: [Citas - Paciente]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nuevoHorario]
   *             properties:
   *               nuevoHorario:
   *                 type: string
   *     responses:
   *       200:
   *         description: Cita reprogramada
   */
  router.put('/patient/:id', requireRole(['PACIENTE']), controller.reprogramar);

  /**
   * @swagger
   * /api/appointments/patient/{id}:
   *   delete:
   *     summary: Cancelar cita
   *     description: Cancela una cita reservada
   *     tags: [Citas - Paciente]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Cita cancelada
   */
  router.delete('/patient/:id', requireRole(['PACIENTE']), controller.cancelar);

  /**
   * @swagger
   * /api/appointments/doctor/calendar:
   *   get:
   *     summary: Calendario del médico
   *     description: Obtiene el calendario de citas del médico autenticado
   *     tags: [Citas - Médico]
   *     responses:
   *       200:
   *         description: Calendario del médico
   */
  router.get('/doctor/calendar', requireRole(['MEDICO']), controller.calendarioMedico);

  /**
   * @swagger
   * /api/appointments/doctor/slot-duration:
   *   get:
   *     summary: Duración del slot
   *     description: Obtiene la duración configurada para cada slot de cita
   *     tags: [Citas - Médico]
   *     responses:
   *       200:
   *         description: Duración en minutos
   */
  router.get('/doctor/slot-duration', requireRole(['MEDICO']), controller.obtenerSlotDuration);

  /**
   * @swagger
   * /api/appointments/doctor/{id}/status:
   *   patch:
   *     summary: Cambiar estado de cita
   *     description: Médico marca la cita como completada, no presentado, etc
   *     tags: [Citas - Médico]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [estado]
   *             properties:
   *               estado:
   *                 type: string
   *                 enum: [COMPLETADA, NO_PRESENTADO, CANCELADA]
   *     responses:
   *       200:
   *         description: Estado actualizado
   */
  router.patch('/doctor/:id/status', requireRole(['MEDICO']), controller.cambiarEstado);

  return router;
}
