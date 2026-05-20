/**
 * ============================================================================
 * Composition Root del módulo de usuarios
 * ============================================================================
 * Único lugar donde se instancian las implementaciones concretas y se
 * conectan con las abstracciones del dominio.
 * ============================================================================
 */

import { env } from '@/env';
import { CrearUsuarioUseCase } from '@/modules/usuarios/application/features/crear-usuario/crear-usuario.use-case';
import { IniciarSesionUseCase } from '@/modules/usuarios/application/features/iniciar-sesion/iniciar-sesion.use-case';
import { ObtenerPerfilUseCase } from '@/modules/usuarios/application/features/obtener-perfil/obtener-perfil.use-case';
import { ActualizarPerfilUseCase } from '@/modules/usuarios/application/features/actualizar-perfil/actualizar-perfil.use-case';
import { ListarUsuariosPorIdsUseCase } from '@/modules/usuarios/application/features/listar-usuarios-por-ids/listar-usuarios-por-ids.use-case';
import { PrismaUsuarioRepository } from '@/modules/usuarios/infrastructure/adapters/out/persistence/prisma-usuario.repository';
import { BcryptHashAdapter } from '@/modules/usuarios/infrastructure/adapters/out/hash/bcrypt-hash.adapter';
import { UsuariosController } from '@/modules/usuarios/infrastructure/adapters/in/http/usuarios.controller';
import { createUsuariosRouter } from '@/modules/usuarios/infrastructure/adapters/in/http/usuarios.router';

// ─── Adaptadores de salida (implementaciones concretas) ─────────────────────
const usuarioRepository = new PrismaUsuarioRepository();
const hashService = new BcryptHashAdapter();

// ─── Casos de uso ───────────────────────────────────────────────────────────
const crearUsuarioUseCase = new CrearUsuarioUseCase(usuarioRepository, hashService, {
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
});
const iniciarSesionUseCase = new IniciarSesionUseCase(usuarioRepository, hashService, {
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
});
const obtenerPerfilUseCase = new ObtenerPerfilUseCase(usuarioRepository);
const actualizarPerfilUseCase = new ActualizarPerfilUseCase(usuarioRepository);
const listarUsuariosPorIdsUseCase = new ListarUsuariosPorIdsUseCase(usuarioRepository);

// ─── Controlador ────────────────────────────────────────────────────────────
const usuariosController = new UsuariosController(
  crearUsuarioUseCase,
  iniciarSesionUseCase,
  obtenerPerfilUseCase,
  actualizarPerfilUseCase,
  listarUsuariosPorIdsUseCase,
);

// ─── Router ─────────────────────────────────────────────────────────────────
export const usuariosRouter = createUsuariosRouter(usuariosController, env.JWT_SECRET);
