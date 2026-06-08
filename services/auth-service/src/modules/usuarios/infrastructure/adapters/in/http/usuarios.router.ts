/**
 * ============================================================================
 * Router del módulo de usuarios
 * ============================================================================
 * Mapea las rutas HTTP a los métodos del controlador.
 * ============================================================================
 */

import { Router } from 'express';
import { jwtMiddleware } from '@clinica-x/shared-middleware';
import type { UsuariosController } from './usuarios.controller';

export function createUsuariosRouter(
  controller: UsuariosController,
  jwtSecret: string,
): Router {
  const router = Router();

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Registrar un nuevo usuario
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password, nombre, apellido, dni]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: paciente@clinica.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: MiPassword123!
   *               nombre:
   *                 type: string
   *                 example: Ana
   *               apellido:
   *                 type: string
   *                 example: García
   *               dni:
   *                 type: string
   *                 example: "12345678"
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Usuario'
   *       400:
   *         description: Datos inválidos
   *       409:
   *         description: El email ya está registrado
   */
  router.post('/register', controller.registrar);

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Iniciar sesión
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: paciente@clinica.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: MiPassword123!
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT token con expiración de 1 día
   *                 usuario:
   *                   $ref: '#/components/schemas/Usuario'
   *       401:
   *         description: Credenciales inválidas
   *       404:
   *         description: Usuario no encontrado
   */
  router.post('/login', controller.login);

  /**
   * @swagger
   * /api/auth/forgot-password:
   *   post:
   *     summary: Solicitar recuperación de contraseña
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: paciente@clinica.com
   *     responses:
   *       200:
   *         description: Email de recuperación enviado (si el usuario existe)
   *       400:
   *         description: Email requerido
   */
  router.post('/forgot-password', controller.forgotPassword);

  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     summary: Restablecer contraseña con token
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [token, password]
   *             properties:
   *               token:
   *                 type: string
   *                 description: Token de recuperación recibido por email
   *               password:
   *                 type: string
   *                 format: password
   *                 example: NuevaPassword123!
   *     responses:
   *       200:
   *         description: Contraseña restablecida exitosamente
   *       400:
   *         description: Token inválido o expirado
   */
  router.post('/reset-password', controller.resetPassword);

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Obtener perfil del usuario autenticado
   *     tags: [Perfil]
   *     responses:
   *       200:
   *         description: Datos del usuario autenticado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Usuario'
   *       401:
   *         description: No autorizado - token inválido o faltante
   *   put:
   *     summary: Actualizar perfil del usuario autenticado
   *     tags: [Perfil]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: Ana
   *               apellido:
   *                 type: string
   *                 example: García
   *               telefono:
   *                 type: string
   *                 nullable: true
   *                 example: "123456789"
   *     responses:
   *       200:
   *         description: Perfil actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Usuario'
   *       400:
   *         description: Datos inválidos
   *       401:
   *         description: No autorizado
   */
  router.get('/me', jwtMiddleware({ secret: jwtSecret }), controller.me);

  router.put('/me', jwtMiddleware({ secret: jwtSecret }), controller.actualizarMe);

  // Internas
  router.get('/internal/users', controller.listarPorIds);

  return router;
}
