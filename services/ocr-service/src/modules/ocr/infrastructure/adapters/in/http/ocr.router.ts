import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { OcrController } from './ocr.controller';
import { env } from '@/env';
import { requireRole } from '@clinica-x/shared-middleware';

function requireInternalApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-internal-api-key'];
  if (!apiKey || apiKey !== env.INTERNAL_API_KEY) {
    res.status(403).json({
      success: false,
      error: { codigo: 'FORBIDDEN', mensaje: 'Acceso denegado. Se requiere API key interna.' },
    });
    return;
  }
  next();
}

export function createOcrRouter(controller: OcrController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/ocr/process:
   *   post:
   *     summary: Encolar procesamiento OCR (Interno)
   *     description: |
   *       Recibe la solicitud de extraccion de parametros para un archivo de analisis clinicos recien subido.
   *       Valida los datos y encola el analisis asincronico usando el motor de Inteligencia Artificial (OCR).
   *       Requiere una API Key interna (x-internal-api-key) en las cabeceras para la seguridad de la comunicacion.
   *     tags: [Procesamiento OCR]
   *     parameters:
   *       - in: header
   *         name: x-internal-api-key
   *         required: true
   *         schema:
   *           type: string
   *         description: Clave API secreta de comunicacion inter-servicio.
   *         example: "internal-secret-key-123"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [archivoId, ordenAnalisisId, pacienteId, tipoAnalisis]
   *             properties:
   *               archivoId:
   *                 type: string
   *                 format: uuid
   *                 description: ID del archivo registrado en el file-service.
   *                 example: "110e8400-e29b-41d4-a716-446655440000"
   *               ordenAnalisisId:
   *                 type: string
   *                 format: uuid
   *                 description: ID de la orden de analisis clinicos en la base de datos clinica.
   *                 example: "220e8400-e29b-41d4-a716-446655440000"
   *               pacienteId:
   *                 type: string
   *                 format: uuid
   *                 description: ID del paciente dueno de los resultados.
   *                 example: "330e8400-e29b-41d4-a716-446655440000"
   *               tipoAnalisis:
   *                 type: string
   *                 enum: [SANGRE, ORINA, HECES]
   *                 example: "SANGRE"
   *                 description: Categoria de analisis para enfocar el modelo extractor.
   *               consultaId:
   *                 type: string
   *                 format: uuid
   *                 nullable: true
   *                 description: ID opcional de la consulta clinica origen.
   *                 example: "440e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Solicitud de analisis recibida y proceso encolado de forma asincrona.
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
   *                       example: "Analisis OCR encolado exitosamente"
   *                     archivoId:
   *                       type: string
   *                       format: uuid
   *                     estado:
   *                       type: string
   *                       example: "PENDIENTE"
   *       400:
   *         description: Parametros de cuerpo de solicitud invalidos o incompletos.
   *       403:
   *         description: Acceso denegado. Cabecera x-internal-api-key ausente o incorrecta.
   *       500:
   *         description: Error al inicializar el worker o base de datos.
   */
  router.post('/process', requireInternalApiKey, controller.procesar);

  /**
   * @swagger
   * /api/ocr/admin/process:
   *   post:
   *     summary: Forzar reprocesamiento OCR manual (Admin)
   *     description: Permite a un usuario con rol ADMIN disparar manualmente el procesamiento OCR sobre un archivo guardado en el storage.
   *     tags: [Procesamiento OCR]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [archivoId, keyS3, tipoAnalisis, pacienteId]
   *             properties:
   *               archivoId:
   *                 type: string
   *                 format: uuid
   *               keyS3:
   *                 type: string
   *                 example: "uploads/2026/06/my-analysis.pdf"
   *                 description: Ruta o key del archivo S3 a procesar.
   *               tipoAnalisis:
   *                 type: string
   *                 enum: [SANGRE, ORINA, HECES]
   *                 example: "SANGRE"
   *               pacienteId:
   *                 type: string
   *                 format: uuid
   *               ordenAnalisisId:
   *                 type: string
   *                 format: uuid
   *                 nullable: true
   *               consultaId:
   *                 type: string
   *                 format: uuid
   *                 nullable: true
   *     responses:
   *       200:
   *         description: Procesamiento forzado iniciado correctamente.
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
   *                       example: "Reprocesamiento forzado iniciado"
   *       400:
   *         description: Parametros incompletos.
   *       401:
   *         description: No autorizado. JWT invalido.
   *       403:
   *         description: Acceso prohibido. Se requiere rol ADMIN.
   */
  router.post('/admin/process', requireRole(['ADMIN']), controller.procesarAdmin);

  /**
   * @swagger
   * /api/ocr/results/{archivoId}:
   *   get:
   *     summary: Obtener resultados estructurados por archivo
   *     description: Recupera la informacion clinica extraida (valores, rangos, etc.) para un archivo especifico.
   *     tags: [Procesamiento OCR]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: archivoId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico del archivo analizado.
   *     responses:
   *       200:
   *         description: Resultados estructurados encontrados.
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
   *                     archivoId:
   *                       type: string
   *                       format: uuid
   *                     pacienteId:
   *                       type: string
   *                       format: uuid
   *                     tipoAnalisis:
   *                       type: string
   *                       example: "SANGRE"
   *                     datosExtraidos:
   *                       type: object
   *                       description: JSON con los parametros medicos estructurados (ej. Glucosa, Colesterol).
   *                       example: { "Glucosa": "95 mg/dL", "Hemoglobina": "14.2 g/dL" }
   *       404:
   *         description: No se encontraron resultados guardados para el archivo provisto.
   */
  router.get('/results/:archivoId', controller.obtenerPorArchivo);

  /**
   * @swagger
   * /api/ocr/results/order/{ordenAnalisisId}:
   *   get:
   *     summary: Obtener resultados estructurados por orden
   *     description: Recupera los datos clinicos extraidos mediante OCR asociados a una orden de analisis clinicos.
   *     tags: [Procesamiento OCR]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: ordenAnalisisId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico de la orden de analisis.
   *     responses:
   *       200:
   *         description: Resultados recuperados exitosamente.
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
   *                     ordenAnalisisId:
   *                       type: string
   *                       format: uuid
   *                     datosExtraidos:
   *                       type: object
   *       404:
   *         description: No se encontraron resultados asociados a la orden.
   */
  router.get('/results/order/:ordenAnalisisId', controller.obtenerPorOrden);

  /**
   * @swagger
   * /api/ocr/results/paciente/{pacienteId}:
   *   get:
   *     summary: Listar todos los resultados de un paciente
   *     description: Obtiene el listado completo de todos los analisis clinicos estructurados mediante OCR pertenecientes a un paciente.
   *     tags: [Procesamiento OCR]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pacienteId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico del paciente.
   *     responses:
   *       200:
   *         description: Historial de resultados estructurados obtenido.
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
   *                       archivoId:
   *                         type: string
   *                         format: uuid
   *                       tipoAnalisis:
   *                         type: string
   *                       fechaCreacion:
   *                         type: string
   *                         format: date-time
   */
  router.get('/results/paciente/:pacienteId', controller.listarPorPaciente);

  /**
   * @swagger
   * /api/ocr/status/{archivoId}:
   *   get:
   *     summary: Consultar estado de procesamiento OCR
   *     description: Permite conocer el estado en tiempo real de la tarea en cola (ej. PENDIENTE, PROCESANDO, COMPLETADO, ERROR).
   *     tags: [Procesamiento OCR]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: archivoId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico del archivo que esta siendo procesado.
   *     responses:
   *       200:
   *         description: Estado devuelto con exito.
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
   *                     archivoId:
   *                       type: string
   *                       format: uuid
   *                     estado:
   *                       type: string
   *                       example: "COMPLETADO"
   *                     intentos:
   *                       type: integer
   *                       example: 1
   *                     error:
   *                       type: string
   *                       nullable: true
   */
  router.get('/status/:archivoId', controller.status);

  return router;
}
