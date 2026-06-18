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

  /**
   * @swagger
   * /api/admin/doctors:
   *   get:
   *     summary: Listar médicos
   *     description: Obtiene la lista de todos los médicos registrados en el sistema
   *     tags: [Médicos]
   *     responses:
   *       200:
   *         description: Lista de médicos obtenida correctamente
   *       401:
   *         description: No autorizado
   */
  router.get('/', controller.listar);

  /**
   * @swagger
   * /api/admin/doctors:
   *   post:
   *     summary: Crear médico
   *     description: Crea un nuevo registro de médico en el sistema
   *     tags: [Médicos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nombre, apellido, especialidadId]
   *             properties:
   *               nombre:
   *                 type: string
   *               apellido:
   *                 type: string
   *               especialidadId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Médico creado correctamente
   *       400:
   *         description: Datos inválidos
   */
  router.post('/', controller.crear);

  /**
   * @swagger
   * /api/admin/doctors/{id}:
   *   get:
   *     summary: Obtener médico por ID
   *     description: Obtiene los detalles de un médico específico
   *     tags: [Médicos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Detalles del médico
   *       404:
   *         description: Médico no encontrado
   */
  router.get('/:id', controller.obtener);

  /**
   * @swagger
   * /api/admin/doctors/{id}:
   *   put:
   *     summary: Actualizar médico
   *     description: Actualiza los datos de un médico existente
   *     tags: [Médicos]
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
   *             properties:
   *               nombre:
   *                 type: string
   *               apellido:
   *                 type: string
   *               especialidadId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Médico actualizado correctamente
   *       404:
   *         description: Médico no encontrado
   */
  router.put('/:id', controller.actualizar);

  /**
   * @swagger
   * /api/admin/doctors/{id}/status:
   *   patch:
   *     summary: Cambiar estado del médico
   *     description: Activa o desactiva un médico en el sistema
   *     tags: [Médicos]
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
   *             required: [activo]
   *             properties:
   *               activo:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Estado actualizado
   *       404:
   *         description: Médico no encontrado
   */
  router.patch('/:id/status', controller.cambiarEstado);

  return router;
}
