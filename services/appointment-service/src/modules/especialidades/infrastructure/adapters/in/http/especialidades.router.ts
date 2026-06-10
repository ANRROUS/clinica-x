import { Router } from 'express';
import type { EspecialidadesController } from './especialidades.controller';

export function createEspecialidadesRouter(
  controller: EspecialidadesController,
): Router {
  const router = Router();

  /**
   * @swagger
   * /api/admin/specialties:
   *   get:
   *     summary: Listar especialidades
   *     description: Obtiene la lista de todas las especialidades disponibles
   *     tags: [Especialidades]
   *     responses:
   *       200:
   *         description: Lista de especialidades
   *       401:
   *         description: No autorizado
   */
  router.get('/', controller.listar);

  /**
   * @swagger
   * /api/admin/specialties:
   *   post:
   *     summary: Crear especialidad
   *     description: Crea una nueva especialidad médica
   *     tags: [Especialidades]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nombre]
   *             properties:
   *               nombre:
   *                 type: string
   *               descripcion:
   *                 type: string
   *     responses:
   *       201:
   *         description: Especialidad creada
   *       400:
   *         description: Datos inválidos
   */
  router.post('/', controller.crear);

  /**
   * @swagger
   * /api/admin/specialties/{id}:
   *   put:
   *     summary: Actualizar especialidad
   *     description: Actualiza los datos de una especialidad existente
   *     tags: [Especialidades]
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
   *               descripcion:
   *                 type: string
   *     responses:
   *       200:
   *         description: Especialidad actualizada
   *       404:
   *         description: No encontrada
   */
  router.put('/:id', controller.actualizar);

  /**
   * @swagger
   * /api/admin/specialties/{id}/status:
   *   patch:
   *     summary: Cambiar estado especialidad
   *     description: Activa o desactiva una especialidad
   *     tags: [Especialidades]
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
   */
  router.patch('/:id/status', controller.cambiarEstado);

  return router;
}
