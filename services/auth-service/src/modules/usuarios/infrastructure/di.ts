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
import { SolicitarRecuperacionUseCase } from '@/modules/usuarios/application/features/solicitar-recuperacion/solicitar-recuperacion.use-case';
import { RestablecerContrasenaUseCase } from '@/modules/usuarios/application/features/restablecer-contrasena/restablecer-contrasena.use-case';
import { PrismaUsuarioRepository } from '@/modules/usuarios/infrastructure/adapters/out/persistence/prisma-usuario.repository';
import { BcryptHashAdapter } from '@/modules/usuarios/infrastructure/adapters/out/hash/bcrypt-hash.adapter';
import { SupabaseEdgeFunctionCorreoAdapter } from '@/modules/usuarios/infrastructure/adapters/out/external-apis/supabase-correo.adapter';
import { UsuariosController } from '@/modules/usuarios/infrastructure/adapters/in/http/usuarios.controller';
import { createUsuariosRouter } from '@/modules/usuarios/infrastructure/adapters/in/http/usuarios.router';

// ─── Adaptadores de salida (implementaciones concretas) ─────────────────────
const usuarioRepository = new PrismaUsuarioRepository();
const hashService = new BcryptHashAdapter();
const servicioCorreo = new SupabaseEdgeFunctionCorreoAdapter();

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
const solicitarRecuperacionUseCase = new SolicitarRecuperacionUseCase(
  usuarioRepository,
  servicioCorreo,
  env.FRONTEND_URL,
);
const restablecerContrasenaUseCase = new RestablecerContrasenaUseCase(
  usuarioRepository,
  hashService,
);

// ─── Controlador ────────────────────────────────────────────────────────────
const usuariosController = new UsuariosController(
  crearUsuarioUseCase,
  iniciarSesionUseCase,
  obtenerPerfilUseCase,
  actualizarPerfilUseCase,
  listarUsuariosPorIdsUseCase,
  solicitarRecuperacionUseCase,
  restablecerContrasenaUseCase,
  usuarioRepository,
  hashService,
);

// ─── Router ─────────────────────────────────────────────────────────────────
export const usuariosRouter = createUsuariosRouter(usuariosController, env.JWT_SECRET);
