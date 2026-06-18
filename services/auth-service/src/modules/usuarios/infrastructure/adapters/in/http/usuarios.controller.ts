/**
 * ============================================================================
 * UsuariosController — Adaptador de entrada HTTP
 * ============================================================================
 * Recibe requests Express, extrae datos planos, invoca casos de uso a través
 * de los puertos de entrada, y responde con DTOs.
 * ============================================================================
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { z } from 'zod';
import { env } from '@/env';
import { createLayerLogger, getTraceFromRequest } from '@/shared/layer-logger';
import type {
  ICrearUsuarioPort,
  IIniciarSesionPort,
  IObtenerPerfilPort,
  IActualizarPerfilPort,
  IListarUsuariosPorIdsPort,
  ISolicitarRecuperacionPort,
  IRestablecerContrasenaPort,
} from '@/modules/usuarios/domain/ports/in/usuarios.port';
import type { IUsuarioRepository, IHashService } from '@/modules/usuarios/domain/ports/out/usuario.repository.port';
import { Dni } from '@/modules/usuarios/domain/value-objects/dni.vo';
import { Email } from '@/modules/usuarios/domain/value-objects/email.vo';

// ─── Schemas de validación Zod para entrada HTTP ────────────────────────────

const registrarSchema = z.object({
  dni: z.string().length(8).regex(/^\d+$/, 'El DNI debe tener 8 dígitos numéricos'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  telefono: z.string().optional(),
  rol: z.enum(['PACIENTE', 'MEDICO', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'La contraseña es requerida'),
  dni: z.string().optional(),
});

const actualizarPerfilSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
});

const solicitarRecuperacionSchema = z.object({
  email: z.string().email('Correo inválido'),
});

const restablecerContrasenaSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  nuevaContrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

const actualizarUsuarioAdminSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  dni: z.string().length(8).regex(/^\d+$/).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  password: z.string().min(8).optional(),
});

export class UsuariosController {
  constructor(
    private readonly crearUsuario: ICrearUsuarioPort,
    private readonly iniciarSesion: IIniciarSesionPort,
    private readonly obtenerPerfil: IObtenerPerfilPort,
    private readonly actualizarPerfil: IActualizarPerfilPort,
    private readonly listarUsuariosPorIds: IListarUsuariosPorIdsPort,
    private readonly solicitarRecuperacion: ISolicitarRecuperacionPort,
    private readonly restablecerContrasena: IRestablecerContrasenaPort,
    private readonly usuarioRepository?: IUsuarioRepository,
    private readonly hashService?: IHashService,
  ) {}

  // ─── POST /api/auth/register ──────────────────────────────────────────────
  registrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const log = createLayerLogger('auth-service', getTraceFromRequest(req), 'usuarios', 'crear-usuario');
    try {
      log.info('controller', 'Request de registro recibido');

      const dto = registrarSchema.parse(req.body);
      log.debug('application', 'DTO de registro validado', { input: { dni: dto.dni, email: dto.email, nombre: dto.nombre } });

      // Protección: solo requests internos pueden crear roles distintos a PACIENTE
      if (dto.rol && dto.rol !== 'PACIENTE') {
        const apiKey = req.headers['x-internal-api-key'];
        if (apiKey !== env.INTERNAL_API_KEY) {
          log.warn('controller', 'Intento de creación de rol no autorizado', { input: { rol: dto.rol } });
          res.status(403).json({
            success: false,
            error: { codigo: 'FORBIDDEN', mensaje: 'No autorizado para crear este rol' },
          });
          return;
        }
      }

      const resultado = await this.crearUsuario.execute(dto);

      if (resultado.isErr) {
        log.warn('controller', 'Error al crear usuario', { error: { message: resultado.error.message } });
        res.status(409).json({
          success: false,
          error: { codigo: 'USUARIO_DUPLICADO', mensaje: resultado.error.message },
        });
        return;
      }

      log.info('controller', 'Usuario registrado exitosamente', { output: { userId: resultado.value.usuario.id } });
      res.status(201).json({ success: true, data: resultado.value });
    } catch (err) {
      if (err instanceof ZodError) {
        log.warn('controller', 'Error de validación Zod', { error: { name: 'ZodError', message: 'Datos inválidos' } });
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDACION',
            mensaje: 'Datos inválidos',
            detalles: err.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
          },
        });
        return;
      }
      log.error('controller', 'Error inesperado en registro', err as Error);
      next(err);
    }
  };

  // ─── POST /api/auth/login ─────────────────────────────────────────────────
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const log = createLayerLogger('auth-service', getTraceFromRequest(req), 'usuarios', 'iniciar-sesion');
    try {
      log.info('controller', 'Request recibido', { httpMethod: req.method, httpPath: req.path });

      const dto = loginSchema.parse(req.body);
      log.debug('application', 'DTO validado exitosamente', { input: { email: dto.email } });

      const resultado = await this.iniciarSesion.execute(dto);

      if (resultado.isErr) {
        log.warn('controller', 'Credenciales inválidas', { error: { message: resultado.error.message } });
        res.status(401).json({
          success: false,
          error: { codigo: 'CREDENCIALES_INVALIDAS', mensaje: resultado.error.message },
        });
        return;
      }

      log.info('controller', 'Login exitoso', { output: { userId: resultado.value.usuario.id, tokenGenerated: true } });
      res.status(200).json({ success: true, data: resultado.value });
    } catch (err) {
      if (err instanceof ZodError) {
        log.warn('controller', 'Error de validación Zod', { error: { name: 'ZodError', message: 'Datos inválidos' } });
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDACION',
            mensaje: 'Datos inválidos',
            detalles: err.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
          },
        });
        return;
      }
      log.error('controller', 'Error inesperado', err as Error);
      next(err);
    }
  };

  // ─── GET /api/auth/me ─────────────────────────────────────────────────────
  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const log = createLayerLogger('auth-service', getTraceFromRequest(req), 'usuarios', 'obtener-perfil');
    try {
      log.info('controller', 'Request de perfil recibido');

      const usuarioId = req.user?.sub;
      if (!usuarioId) {
        log.warn('controller', 'Token inválido o faltante');
        res.status(401).json({
          success: false,
          error: { codigo: 'NO_AUTENTICADO', mensaje: 'Token inválido o faltante' },
        });
        return;
      }

      const resultado = await this.obtenerPerfil.execute(usuarioId);
      if (resultado.isErr) {
        log.warn('controller', 'Usuario no encontrado', { error: { message: resultado.error.message } });
        res.status(404).json({
          success: false,
          error: { codigo: 'USUARIO_NO_ENCONTRADO', mensaje: resultado.error.message },
        });
        return;
      }

      log.info('controller', 'Perfil obtenido exitosamente', { output: { userId: resultado.value.id } });
      res.status(200).json({ success: true, data: resultado.value });
    } catch (err) {
      log.error('controller', 'Error inesperado al obtener perfil', err as Error);
      next(err);
    }
  };

  // ─── PUT /api/auth/me ─────────────────────────────────────────────────────
  actualizarMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const log = createLayerLogger('auth-service', getTraceFromRequest(req), 'usuarios', 'actualizar-perfil');
    try {
      log.info('controller', 'Request de actualización de perfil recibido');

      const usuarioId = req.user?.sub;
      if (!usuarioId) {
        log.warn('controller', 'Token inválido o faltante');
        res.status(401).json({
          success: false,
          error: { codigo: 'NO_AUTENTICADO', mensaje: 'Token inválido o faltante' },
        });
        return;
      }

      const dto = actualizarPerfilSchema.parse(req.body);
      log.debug('application', 'DTO de actualización validado', { input: dto });

      const resultado = await this.actualizarPerfil.execute(usuarioId, dto);

      if (resultado.isErr) {
        const status = (resultado.error as any).httpStatus || 400;
        log.warn('controller', 'Error al actualizar perfil', { error: { message: resultado.error.message, httpStatus: status } });
        res.status(status).json({
          success: false,
          error: { codigo: (resultado.error as any).codigo || 'ERROR', mensaje: resultado.error.message },
        });
        return;
      }

      log.info('controller', 'Perfil actualizado exitosamente', { output: { userId: resultado.value.id } });
      res.status(200).json({ success: true, data: resultado.value });
    } catch (err) {
      if (err instanceof ZodError) {
        log.warn('controller', 'Error de validación Zod', { error: { name: 'ZodError', message: 'Datos inválidos' } });
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDACION',
            mensaje: 'Datos inválidos',
            detalles: err.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
          },
        });
        return;
      }
      log.error('controller', 'Error inesperado al actualizar perfil', err as Error);
      next(err);
    }
  };

  // ─── GET /api/auth/internal/users ─────────────────────────────────────────
  listarPorIds = async (req: Request, res: Response): Promise<void> => {
    const apiKey = req.headers['x-internal-api-key'];
    if (apiKey !== env.INTERNAL_API_KEY) {
      res.status(403).json({
        success: false,
        error: { codigo: 'FORBIDDEN', mensaje: 'No autorizado' },
      });
      return;
    }

    const idsParam = typeof req.query.ids === 'string' ? req.query.ids : '';
    const ids = idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      res.status(200).json({ success: true, data: { usuarios: [] } });
      return;
    }

    const resultado = await this.listarUsuariosPorIds.execute(ids);
    if (resultado.isErr) {
      res.status(500).json({
        success: false,
        error: { codigo: 'ERROR', mensaje: resultado.error.message },
      });
      return;
    }

    res.status(200).json({ success: true, data: { usuarios: resultado.value } });
  };

  // ─── PUT /api/auth/internal/users/:id ────────────────────────────────────
  actualizarPorId = async (req: Request, res: Response): Promise<void> => {
    const apiKey = req.headers['x-internal-api-key'];
    if (apiKey !== env.INTERNAL_API_KEY) {
      res.status(403).json({
        success: false,
        error: { codigo: 'FORBIDDEN', mensaje: 'No autorizado' },
      });
      return;
    }

    if (!this.usuarioRepository || !this.hashService) {
      res.status(500).json({
        success: false,
        error: { codigo: 'ERROR', mensaje: 'Servicio no configurado correctamente' },
      });
      return;
    }

    const usuarioId = req.params.id;
    if (!usuarioId) {
      res.status(400).json({
        success: false,
        error: { codigo: 'VALIDACION', mensaje: 'ID de usuario requerido' },
      });
      return;
    }

    let dto: z.infer<typeof actualizarUsuarioAdminSchema>;
    try {
      dto = actualizarUsuarioAdminSchema.parse(req.body);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDACION',
            mensaje: 'Datos inválidos',
            detalles: err.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
          },
        });
        return;
      }
      throw err;
    }

    try {
      const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
      if (!usuario) {
        res.status(404).json({
          success: false,
          error: { codigo: 'USUARIO_NO_ENCONTRADO', mensaje: `Usuario ${usuarioId} no encontrado` },
        });
        return;
      }

      if (dto.email && dto.email !== usuario.email.value) {
        const existente = await this.usuarioRepository.buscarPorEmail(dto.email);
        if (existente && existente.id !== usuarioId) {
          res.status(409).json({
            success: false,
            error: { codigo: 'USUARIO_DUPLICADO', mensaje: 'El correo ya está en uso por otro usuario' },
          });
          return;
        }
      }

      if (dto.dni && dto.dni !== usuario.dni.value) {
        const existente = await this.usuarioRepository.buscarPorDni(dto.dni);
        if (existente && existente.id !== usuarioId) {
          res.status(409).json({
            success: false,
            error: { codigo: 'USUARIO_DUPLICADO', mensaje: 'El DNI ya está en uso por otro usuario' },
          });
          return;
        }
      }

      usuario.actualizarPerfil({
        nombre: dto.nombre,
        apellido: dto.apellido,
        telefono: dto.telefono,
      });

      if (dto.email && dto.email !== usuario.email.value) {
        const emailResult = Email.create(dto.email);
        if (emailResult.isErr) {
          res.status(400).json({
            success: false,
            error: { codigo: 'VALIDACION', mensaje: emailResult.error.message },
          });
          return;
        }
        Object.assign(usuario, { _email: emailResult.value });
      }

      if (dto.dni && dto.dni !== usuario.dni.value) {
        const dniResult = Dni.create(dto.dni);
        if (dniResult.isErr) {
          res.status(400).json({
            success: false,
            error: { codigo: 'VALIDACION', mensaje: dniResult.error.message },
          });
          return;
        }
        Object.assign(usuario, { _dni: dniResult.value });
      }

      if (dto.password) {
        const hash = await this.hashService.hash(dto.password);
        usuario.cambiarPasswordHash(hash);
      }

      await this.usuarioRepository.actualizar(usuario);

      res.status(200).json({
        success: true,
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          dni: usuario.dni.value,
          email: usuario.email.value,
          telefono: usuario.telefono,
          rol: usuario.rol,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: { codigo: 'ERROR', mensaje: 'Error interno al actualizar usuario' },
      });
    }
  };

  // ─── POST /api/auth/forgot-password ──────────────────────────────────────
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const log = createLayerLogger('auth-service', getTraceFromRequest(req), 'usuarios', 'solicitar-recuperacion');
    try {
      log.info('controller', 'Request de recuperación de contraseña recibido');

      const dto = solicitarRecuperacionSchema.parse(req.body);
      log.debug('application', 'DTO de recuperación validado', { input: { email: dto.email } });

      const resultado = await this.solicitarRecuperacion.execute(dto.email);

      if (resultado.isErr) {
        log.warn('controller', 'Error al solicitar recuperación', { error: { message: resultado.error.message } });
        res.status(400).json({
          success: false,
          error: { codigo: 'ERROR', mensaje: resultado.error.message },
        });
        return;
      }

      log.info('controller', 'Solicitud de recuperación procesada');
      res.status(200).json({ success: true, data: resultado.value });
    } catch (err) {
      if (err instanceof ZodError) {
        log.warn('controller', 'Error de validación Zod', { error: { name: 'ZodError', message: 'Datos inválidos' } });
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDACION',
            mensaje: 'Datos inválidos',
            detalles: err.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
          },
        });
        return;
      }
      log.error('controller', 'Error inesperado en recuperación', err as Error);
      next(err);
    }
  };

  // ─── POST /api/auth/reset-password ───────────────────────────────────────
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const log = createLayerLogger('auth-service', getTraceFromRequest(req), 'usuarios', 'restablecer-contrasena');
    try {
      log.info('controller', 'Request de restablecimiento de contraseña recibido');

      const dto = restablecerContrasenaSchema.parse(req.body);
      log.debug('application', 'DTO de restablecimiento validado');

      const resultado = await this.restablecerContrasena.execute(dto.token, dto.nuevaContrasena);

      if (resultado.isErr) {
        const err = resultado.error as any;
        const status = err.httpStatus || 400;
        log.warn('controller', 'Error al restablecer contraseña', { error: { message: resultado.error.message, httpStatus: status } });
        res.status(status).json({
          success: false,
          error: { codigo: err.codigo || 'ERROR', mensaje: resultado.error.message },
        });
        return;
      }

      log.info('controller', 'Contraseña restablecida exitosamente');
      res.status(200).json({ success: true, data: resultado.value });
    } catch (err) {
      if (err instanceof ZodError) {
        log.warn('controller', 'Error de validación Zod', { error: { name: 'ZodError', message: 'Datos inválidos' } });
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDACION',
            mensaje: 'Datos inválidos',
            detalles: err.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
          },
        });
        return;
      }
      log.error('controller', 'Error inesperado en restablecimiento', err as Error);
      next(err);
    }
  };
}
