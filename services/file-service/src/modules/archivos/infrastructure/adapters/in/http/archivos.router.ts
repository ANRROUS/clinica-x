/**
 * ============================================================================
 * Router del módulo de archivos
 * ============================================================================
 * Rutas bajo /api/files
 * ============================================================================
 */

import { Router } from 'express';
import multer from 'multer';
import type { ArchivosController } from './archivos.controller';

const upload = multer({ storage: multer.memoryStorage() });

export function createArchivosRouter(controller: ArchivosController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/files/upload:
   *   post:
   *     summary: Subir un archivo al storage
   *     description: |
   *       Permite subir un archivo fisico (formato PDF o imagen) al servicio de almacenamiento en la nube.
   *       El archivo queda asociado a un modulo/servicio especifico (ej. CLINICAL) y a un recurso
   *       (ej. ID de una orden de analisis clinicos) para auditoria y busqueda posterior.
   *     tags: [Gestion de Archivos]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required: [file, propietarioServicio, propietarioRecursoId]
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: "Archivo fisico binario. Extensiones permitidas: .pdf, .png, .jpeg, .jpg. Tamano maximo: 10MB."
   *               propietarioServicio:
   *                 type: string
   *                 example: "CLINICAL"
   *                 description: Identificador del servicio que es dueno del archivo (ej. CLINICAL, OCR, APPOINTMENTS).
   *               propietarioRecursoId:
   *                 type: string
   *                 format: uuid
   *                 example: "e88d5ea2-f674-4b51-9ff4-22b64d1f2e1a"
   *                 description: ID del recurso de negocio asociado en el microservicio propietario.
   *     responses:
   *       201:
   *         description: Archivo cargado exitosamente. Retorna la referencia del archivo en la base de datos.
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
   *                       example: "330e8400-e29b-41d4-a716-446655440000"
   *                     url:
   *                       type: string
   *                       example: "https://storage.googleapis.com/clinica-x-bucket/uploads/2026/06/myfile.pdf"
   *                     mimeType:
   *                       type: string
   *                       example: "application/pdf"
   *                     sizeBytes:
   *                       type: integer
   *                       example: 1048576
   *       400:
   *         description: Parametros incorrectos, tipo de archivo no permitido o archivo faltante en request.
   *       401:
   *         description: No autorizado. Token JWT ausente o no valido.
   *       413:
   *         description: El archivo excede el tamano limite configurado (10MB).
   *       500:
   *         description: Error interno de comunicacion con el proveedor del storage o base de datos.
   */
  router.post('/upload', upload.single('file'), controller.upload);

  /**
   * @swagger
   * /api/files/{id}/signed-url:
   *   get:
   *     summary: Obtener URL firmada de descarga
   *     description: Genera una URL temporal, segura y firmada criptograficamente para visualizar o descargar el archivo privado desde el storage.
   *     tags: [Gestion de Archivos]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID unico del archivo en la base de datos de referencias.
   *         example: "330e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: URL firmada obtenida correctamente. Valida por tiempo limitado (ej. 15 minutos).
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
   *                     signedUrl:
   *                       type: string
   *                       example: "https://storage.googleapis.com/clinica-x-bucket/uploads/2026/06/myfile.pdf?GoogleAccessId=service-account@project.iam.gserviceaccount.com&Expires=1781292000&Signature=..."
   *       401:
   *         description: Token JWT ausente o invalido.
   *       404:
   *         description: El archivo con el ID provisto no existe en el sistema.
   *       500:
   *         description: Error al generar la firma criptografica con el storage.
   */
  router.get('/:id/signed-url', controller.signedUrl);

  /**
   * @swagger
   * /api/files/{id}:
   *   delete:
   *     summary: Eliminar un archivo
   *     description: Elimina la referencia del archivo en la base de datos y borra de forma permanente el objeto del storage en la nube.
   *     tags: [Gestion de Archivos]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del archivo a eliminar de forma permanente.
   *         example: "330e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Archivo y referencia eliminados exitosamente del sistema.
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
   *                       example: "Archivo eliminado exitosamente"
   *       401:
   *         description: Token JWT ausente o invalido.
   *       404:
   *         description: Archivo no encontrado.
   *       500:
   *         description: Error en base de datos o fallo al invocar la API de eliminacion del storage.
   */
  router.delete('/:id', controller.delete);

  return router;
}
