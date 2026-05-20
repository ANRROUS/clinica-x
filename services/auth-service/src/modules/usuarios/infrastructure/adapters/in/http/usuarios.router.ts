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

  // Públicas
  router.post('/register', controller.registrar);
  router.post('/login', controller.login);

  // Privadas
  router.get('/me', jwtMiddleware({ secret: jwtSecret }), controller.me);
  router.put('/me', jwtMiddleware({ secret: jwtSecret }), controller.actualizarMe);

  // Internas
  router.get('/internal/users', controller.listarPorIds);

  return router;
}
