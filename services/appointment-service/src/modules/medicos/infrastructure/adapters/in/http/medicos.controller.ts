/**
 * ============================================================================
 * MedicosController — Adaptador de entrada HTTP
 * ============================================================================
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import type {
  ICrearMedicoPort,
  IActualizarMedicoPort,
  IListarMedicosPort,
  IObtenerMedicoPort,
  ICambiarEstadoMedicoPort,
  IObtenerMetricasDashboardPort,
} from '@/modules/medicos/domain/ports/in/medicos.port';

// ─── Schemas Zod ────────────────────────────────────────────────────────────

const horarioSchema = z.object({
  diaSemana: z.number().int().min(1).max(7),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:MM'),
  horaFin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:MM'),
});

const crearMedicoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  dni: z.string().length(8).regex(/^\d+$/, 'DNI debe tener 8 dígitos'),
  email: z.string().email('Correo inválido'),
  telefono: z.string().optional(),
  username: z.string().min(4, 'Mínimo 4 caracteres').regex(/^\S+$/, 'Sin espacios'),
  specialtyId: z.string().uuid('Especialidad inválida'),
  shift: z.enum(['MANANA', 'TARDE']),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  schedules: z.array(horarioSchema).min(1, 'Al menos un horario es requerido'),
});

const actualizarMedicoSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  dni: z.string().length(8).regex(/^\d+$/).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  username: z.string().min(4).regex(/^\S+$/).optional(),
  specialtyId: z.string().uuid().optional(),
  shift: z.enum(['MANANA', 'TARDE']).optional(),
  password: z.string().min(8).optional().or(z.literal('')),
  schedules: z.array(horarioSchema).optional(),
});

const cambiarEstadoSchema = z.object({
  activo: z.boolean(),
});

export class MedicosController {
  constructor(
    private readonly crearMedico: ICrearMedicoPort,
    private readonly actualizarMedico: IActualizarMedicoPort,
    private readonly listarMedicos: IListarMedicosPort,
    private readonly obtenerMedico: IObtenerMedicoPort,
    private readonly cambiarEstadoMedico: ICambiarEstadoMedicoPort,
    private readonly obtenerMetricas: IObtenerMetricasDashboardPort,
  ) {}

  // ─── POST /api/admin/doctors ────────────────────────────────────────────────
  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = crearMedicoSchema.parse(req.body);
      const resultado = await this.crearMedico.execute(dto);

      if (resultado.isErr) {
        const err = resultado.error as any;
        const status = err.httpStatus || 400;
        res.status(status).json({
          success: false,
          error: { codigo: err.codigo || 'ERROR', mensaje: err.message },
        });
        return;
      }

      res.status(201).json({ success: true, data: { doctor: resultado.value } });
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

  // ─── PUT /api/admin/doctors/:id ────────────────────────────────────────────
  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicoId = req.params.id;
      const dto = actualizarMedicoSchema.parse(req.body);
      if (dto.password === '') delete (dto as any).password;

      const resultado = await this.actualizarMedico.execute(medicoId, dto);

      if (resultado.isErr) {
        const err = resultado.error as any;
        const status = err.httpStatus || 400;
        res.status(status).json({
          success: false,
          error: { codigo: err.codigo || 'ERROR', mensaje: err.message },
        });
        return;
      }

      res.status(200).json({ success: true, data: { doctor: resultado.value } });
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

  // ─── GET /api/admin/doctors ────────────────────────────────────────────────
  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [medicosResult, metricasResult] = await Promise.all([
        this.listarMedicos.execute(),
        this.obtenerMetricas.execute(),
      ]);

      if (medicosResult.isErr) {
        res.status(500).json({ success: false, error: { mensaje: medicosResult.error.message } });
        return;
      }
      if (metricasResult.isErr) {
        res.status(500).json({ success: false, error: { mensaje: metricasResult.error.message } });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          doctors: medicosResult.value,
          metrics: metricasResult.value,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/admin/doctors/:id ─────────────────────────────────────────────
  obtener = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resultado = await this.obtenerMedico.execute(req.params.id);

      if (resultado.isErr) {
        const err = resultado.error as any;
        const status = err.httpStatus || 404;
        res.status(status).json({
          success: false,
          error: { codigo: err.codigo || 'ERROR', mensaje: err.message },
        });
        return;
      }

      res.status(200).json({ success: true, data: { doctor: resultado.value } });
    } catch (err) {
      next(err);
    }
  };

  // ─── PATCH /api/admin/doctors/:id/status ────────────────────────────────────
  cambiarEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = cambiarEstadoSchema.parse(req.body);
      const resultado = await this.cambiarEstadoMedico.execute(req.params.id, dto);

      if (resultado.isErr) {
        const err = resultado.error as any;
        const status = err.httpStatus || 400;
        res.status(status).json({
          success: false,
          error: { codigo: err.codigo || 'ERROR', mensaje: err.message },
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
