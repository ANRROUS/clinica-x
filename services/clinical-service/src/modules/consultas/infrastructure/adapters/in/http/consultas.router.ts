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

  // ─── Medico ───────────────────────────────────────────────────────────────
  
  /**
   * @swagger
   * /api/medical/doctor/consultation/start:
   *   post:
   *     summary: Iniciar consulta medica
   *     description: |
   *       Permite a un medico con rol MEDICO iniciar formalmente la consulta activa para un paciente.
   *       Este endpoint realiza las siguientes acciones:
   *       1. Cambia el estado de la cita (si se proporciona) a 'EN_CURSO'.
   *       2. Crea un registro de consulta clinica en estado 'INICIADA'.
   *       3. Registra la fecha y hora de inicio de la atencion medica.
   *     tags: [Gestion Clinica - Medico]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [pacienteId]
   *             properties:
   *               pacienteId:
   *                 type: string
   *                 format: uuid
   *                 description: ID del paciente que sera atendido en la consulta.
   *                 example: "550e8400-e29b-41d4-a716-446655440000"
   *               citaId:
   *                 type: string
   *                 format: uuid
   *                 nullable: true
   *                 description: ID de la cita de la agenda asociada a esta atencion (opcional).
   *                 example: "702dc3eb-d2cc-442d-b764-4e9f91095182"
   *               motivoConsulta:
   *                 type: string
   *                 description: Descripcion breve de los sintomas o motivo de la visita medica.
   *                 example: "Dolor abdominal agudo persistente y fiebre moderada"
   *     responses:
   *       201:
   *         description: Consulta iniciada exitosamente. Devuelve el objeto de la consulta medica creada.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       example: "110e8400-e29b-41d4-a716-446655440000"
   *                     citaId:
   *                       type: string
   *                       format: uuid
   *                       nullable: true
   *                       example: "702dc3eb-d2cc-442d-b764-4e9f91095182"
   *                     medicoId:
   *                       type: string
   *                       format: uuid
   *                       example: "990e8400-e29b-41d4-a716-446655440000"
   *                     pacienteId:
   *                       type: string
   *                       format: uuid
   *                       example: "550e8400-e29b-41d4-a716-446655440000"
   *                     estado:
   *                       type: string
   *                       example: "INICIADA"
   *                     motivoConsulta:
   *                       type: string
   *                       example: "Dolor abdominal agudo"
   *                     fechaInicio:
   *                       type: string
   *                       format: date-time
   *                       example: "2026-06-10T15:45:00Z"
   *       400:
   *         description: Datos de entrada invalidos (ID mal formado o faltante).
   *       401:
   *         description: No autorizado. El token JWT falta o no es valido.
   *       403:
   *         description: Acceso denegado. Se requiere rol MEDICO.
   */
  router.post('/doctor/consultation/start', requireRole(['MEDICO']), controller.start);

  /**
   * @swagger
   * /api/medical/doctor/consultation/{id}/finalize:
   *   post:
   *     summary: Finalizar consulta medica
   *     description: |
   *       Finaliza formalmente la consulta medica. Registra el diagnostico definitivo, notas de la consulta,
   *       genera recetas de medicamentos y encola las ordenes de analisis clinicos requeridas para el paciente.
   *       Cambia el estado de la consulta a 'FINALIZADA'.
   *     tags: [Gestion Clinica - Medico]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico de la consulta medica iniciada previamente.
   *         example: "110e8400-e29b-41d4-a716-446655440000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [diagnostico, notas]
   *             properties:
   *               diagnostico:
   *                 type: string
   *                 description: Diagnostico clinico de la consulta.
   *                 example: "Gastroenteritis aguda debido a intoxicacion alimentaria"
   *               notas:
   *                 type: string
   *                 description: Notas de evolucion medica y recomendaciones dieteticas generales.
   *                 example: "Paciente debe guardar reposo por 48 horas e hidratarse con abundante suero oral."
   *               analysisOrders:
   *                 type: array
   *                 description: Lista de analisis clinicos de laboratorio ordenados.
   *                 items:
   *                   type: object
   *                   required: [examName, specialty]
   *                   properties:
   *                     examName:
   *                       type: string
   *                       description: Nombre del examen o analisis clinico.
   *                       example: "Hemograma completo"
   *                     specialty:
   *                       type: string
   *                       description: Especialidad medica asociada al examen.
   *                       example: "HEMATOLOGIA"
   *               medications:
   *                 type: array
   *                 description: Lista de medicamentos recetados al paciente.
   *                 items:
   *                   type: object
   *                   required: [name, days, frequency]
   *                   properties:
   *                     name:
   *                       type: string
   *                       description: Nombre comercial o generico del medicamento con su dosis.
   *                       example: "Paracetamol 500mg"
   *                     days:
   *                       type: integer
   *                       description: Cantidad de dias de duracion del tratamiento.
   *                       example: 5
   *                     frequency:
   *                       type: string
   *                       description: Frecuencia de administracion del medicamento.
   *                       example: "Cada 8 horas"
   *     responses:
   *       200:
   *         description: Consulta finalizada exitosamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     estado:
   *                       type: string
   *                       example: "FINALIZADA"
   *                     diagnostico:
   *                       type: string
   *                     notas:
   *                       type: string
   *                     fechaFin:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Error de negocio o validacion (ej. consulta ya estaba finalizada).
   *       404:
   *         description: La consulta con el ID provisto no existe.
   */
  router.post('/doctor/consultation/:id/finalize', requireRole(['MEDICO']), controller.finalize);

  /**
   * @swagger
   * /api/medical/doctor/active-patient:
   *   get:
   *     summary: Obtener consulta activa del medico
   *     description: |
   *       Recupera los datos del paciente y la consulta que se encuentra actualmente 'INICIADA' (en curso)
   *       para el medico autenticado.
   *     tags: [Gestion Clinica - Medico]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Consulta activa recuperada. Si no existe ninguna activa, devuelve data null.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   nullable: true
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     pacienteId:
   *                       type: string
   *                       format: uuid
   *                     citaId:
   *                       type: string
   *                       format: uuid
   *                     motivoConsulta:
   *                       type: string
   *                     paciente:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         nombre:
   *                           type: string
   *                           example: "Juan"
   *                         apellido:
   *                           type: string
   *                           example: "Perez"
   *                         dni:
   *                           type: string
   *                         email:
   *                           type: string
   */
  router.get('/doctor/active-patient', requireRole(['MEDICO']), controller.activePatient);

  /**
   * @swagger
   * /api/medical/doctor/patients:
   *   get:
   *     summary: Listar agenda de pacientes del medico
   *     description: Obtiene la lista de consultas y pacientes atendidos por el medico, filtrada opcionalmente por fechas.
   *     tags: [Gestion Clinica - Medico]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: desde
   *         schema:
   *           type: string
   *           format: date
   *         example: "2026-06-01"
   *         description: Fecha inicial de busqueda (YYYY-MM-DD)
   *       - in: query
   *         name: hasta
   *         schema:
   *           type: string
   *           format: date
   *         example: "2026-06-30"
   *         description: Fecha final de busqueda (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: Lista de pacientes y consultas obtenida.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         format: uuid
   *                       paciente:
   *                         type: object
   *                         properties:
   *                           nombre:
   *                             type: string
   *                           apellido:
   *                             type: string
   *                       estado:
   *                         type: string
   *                       fechaInicio:
   *                         type: string
   *                         format: date-time
   */
  router.get('/doctor/patients', requireRole(['MEDICO']), controller.doctorPatients);

  /**
   * @swagger
   * /api/medical/doctor/patients/{patientId}:
   *   get:
   *     summary: Obtener historial clinico de un paciente (Medico)
   *     description: Permite a un medico ver el historial completo y detalles personales de un paciente especifico.
   *     tags: [Gestion Clinica - Medico]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico del paciente a consultar.
   *     responses:
   *       200:
   *         description: Detalle del paciente e historial de consultas recuperado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     paciente:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         nombre:
   *                           type: string
   *                         apellido:
   *                           type: string
   *                     historial:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             format: uuid
   *                           diagnostico:
   *                             type: string
   *                           fechaFin:
   *                             type: string
   *                             format: date-time
   *       404:
   *         description: Paciente no encontrado.
   */
  router.get('/doctor/patients/:patientId', requireRole(['MEDICO']), controller.patientDetail);

  // ─── Paciente ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /api/medical/patient/history:
   *   get:
   *     summary: Obtener historial clinico propio (Paciente)
   *     description: Permite al paciente autenticado consultar todo su historial de consultas medicas.
   *     tags: [Gestion Clinica - Paciente]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Historial clinico completo del paciente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         format: uuid
   *                       medico:
   *                         type: object
   *                         properties:
   *                           nombre:
   *                             type: string
   *                           apellido:
   *                             type: string
   *                       diagnostico:
   *                         type: string
   *                       fechaFin:
   *                         type: string
   *                         format: date-time
   */
  router.get('/patient/history', requireRole(['PACIENTE']), controller.patientHistory);

  /**
   * @swagger
   * /api/medical/patient/consultation/{id}:
   *   get:
   *     summary: Obtener detalle de consulta especifica (Paciente)
   *     description: Devuelve el diagnostico, medicamentos recetados y resultados del analisis de una consulta especifica.
   *     tags: [Gestion Clinica - Paciente]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico de la consulta medica.
   *     responses:
   *       200:
   *         description: Detalle de la consulta medica.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     diagnostico:
   *                       type: string
   *                     notas:
   *                       type: string
   *                     fechaFin:
   *                       type: string
   *                       format: date-time
   *                     medico:
   *                       type: object
   *                       properties:
   *                         nombre:
   *                           type: string
   *                         apellido:
   *                           type: string
   *                     recetas:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           medicamento:
   *                             type: string
   *                           dias:
   *                             type: integer
   *                           frecuencia:
   *                             type: string
   *                     ordenesAnalisis:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             format: uuid
   *                           examName:
   *                             type: string
   *                           estado:
   *                             type: string
   *       404:
   *         description: Consulta no encontrada o no pertenece al paciente.
   */
  router.get('/patient/consultation/:id', requireRole(['PACIENTE']), controller.patientConsultation);

  /**
   * @swagger
   * /api/medical/patient/analysis-results:
   *   post:
   *     summary: Registrar resultado de analisis y disparar procesamiento OCR
   *     description: Asocia el archivo subido al storage con la orden de analisis del paciente, y encola la extraccion de datos por OCR de forma asincrona.
   *     tags: [Gestion Clinica - Paciente]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [analysisOrderId, archivoId]
   *             properties:
   *               analysisOrderId:
   *                 type: string
   *                 format: uuid
   *                 example: "110e8400-e29b-41d4-a716-446655440000"
   *               archivoId:
   *                 type: string
   *                 format: uuid
   *                 example: "220e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Resultado registrado exitosamente y proceso OCR encolado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     mensaje:
   *                       type: string
   *                     ordenId:
   *                       type: string
   *                       format: uuid
   *                     estado:
   *                       type: string
   *                       example: "PROCESANDO"
   *       403:
   *         description: No tienes permisos sobre la orden de analisis.
   *       404:
   *         description: Orden de analisis o archivo no encontrado.
   */
  router.post('/patient/analysis-results', requireRole(['PACIENTE']), controller.uploadAnalysisResult);

  return router;
}
