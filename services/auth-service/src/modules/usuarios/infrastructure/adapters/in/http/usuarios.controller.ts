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
import type {
  ICrearUsuarioPort,
  IIniciarSesionPort,
  IObtenerPerfilPort,
  IActualizarPerfilPort,
} from '@/modules/usuarios/domain/ports/in/usuarios.port';

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
  dni: z.string().length(8).regex(/^\d+$/),
  email: z.string().email(),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const actualizarPerfilSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
});

export class UsuariosController {
  constructor(
    private readonly crearUsuario: ICrearUsuarioPort,
    private readonly iniciarSesion: IIniciarSesionPort,
    private readonly obtenerPerfil: IObtenerPerfilPort,
    private readonly actualizarPerfil: IActualizarPerfilPort,
  ) {}

  // ─── POST /api/auth/register ──────────────────────────────────────────────
  registrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = registrarSchema.parse(req.body);

      // Protección: solo requests internos pueden crear roles distintos a PACIENTE
      if (dto.rol && dto.rol !== 'PACIENTE') {
        const apiKey = req.headers['x-internal-api-key'];
        if (apiKey !== env.INTERNAL_API_KEY) {
          res.status(403).json({
            success: false,
            error: { codigo: 'FORBIDDEN', mensaje: 'No autorizado para crear este rol' },
          });
          return;
        }
      }

      const resultado = await this.crearUsuario.execute(dto);

      if (resultado.isErr) {
        res.status(409).json({
          success: false,
          error: { codigo: 'USUARIO_DUPLICADO', mensaje: resultado.error.message },
        });
        return;
      }

      res.status(201).json({ success: true, data: resultado.value });
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
      next(err);
    }
  };

  // ─── POST /api/auth/login ─────────────────────────────────────────────────
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = loginSchema.parse(req.body);
      const resultado = await this.iniciarSesion.execute(dto);

      if (resultado.isErr) {
        res.status(401).json({
          success: false,
          error: { codigo: 'CREDENCIALES_INVALIDAS', mensaje: resultado.error.message },
        });
        return;
      }

      res.status(200).json({ success: true, data: resultado.value });
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
      next(err);
    }
  };

  // ─── GET /api/auth/me ─────────────────────────────────────────────────────
  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarioId = req.user?.sub;
      if (!usuarioId) {
        res.status(401).json({
          success: false,
          error: { codigo: 'NO_AUTENTICADO', mensaje: 'Token inválido o faltante' },
        });
        return;
      }

      const resultado = await this.obtenerPerfil.execute(usuarioId);
      if (resultado.isErr) {
        res.status(404).json({
          success: false,
          error: { codigo: 'USUARIO_NO_ENCONTRADO', mensaje: resultado.error.message },
        });
        return;
      }

      res.status(200).json({ success: true, data: resultado.value });
    } catch (err) {
      next(err);
    }
  };

  // ─── PUT /api/auth/me ─────────────────────────────────────────────────────
  actualizarMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarioId = req.user?.sub;
      if (!usuarioId) {
        res.status(401).json({
          success: false,
          error: { codigo: 'NO_AUTENTICADO', mensaje: 'Token inválido o faltante' },
        });
        return;
      }

      const dto = actualizarPerfilSchema.parse(req.body);
      const resultado = await this.actualizarPerfil.execute(usuarioId, dto);

      if (resultado.isErr) {
        const status = (resultado.error as any).httpStatus || 400;
        res.status(status).json({
          success: false,
          error: { codigo: (resultado.error as any).codigo || 'ERROR', mensaje: resultado.error.message },
        });
        return;
      }

      res.status(200).json({ success: true, data: resultado.value });
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
      next(err);
    }
  };
}
