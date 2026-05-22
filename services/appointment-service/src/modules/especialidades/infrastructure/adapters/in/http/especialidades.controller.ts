import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { createLayerLogger, getTraceFromRequest } from '@/shared/layer-logger';
import type {
  IListarEspecialidadesPort,
  ICrearEspecialidadPort,
  IActualizarEspecialidadPort,
  ICambiarEstadoEspecialidadPort,
} from '@/modules/especialidades/domain/ports/in/especialidades.port';

const crearEspecialidadSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
});

const actualizarEspecialidadSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
});

const cambiarEstadoSchema = z.object({
  activo: z.boolean(),
});

export class EspecialidadesController {
  constructor(
    private readonly listarEspecialidades: IListarEspecialidadesPort,
    private readonly crearEspecialidad: ICrearEspecialidadPort,
    private readonly actualizarEspecialidad: IActualizarEspecialidadPort,
    private readonly cambiarEstadoEspecialidad: ICambiarEstadoEspecialidadPort,
  ) {}

  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resultado = await this.listarEspecialidades.execute();
      if (resultado.isErr) {
        res.status(500).json({ success: false, error: { mensaje: resultado.error.message } });
        return;
      }
      res.status(200).json({ success: true, data: resultado.value });
    } catch (err) {
      next(err);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const log = createLayerLogger('appointment-service', getTraceFromRequest(req), 'especialidades', 'crear-especialidad');
    try {
      log.info('controller', 'Request de creación de especialidad recibido');

      const dto = crearEspecialidadSchema.parse(req.body);
      log.debug('application', 'DTO de especialidad validado', { input: { nombre: dto.nombre } });

      const resultado = await this.crearEspecialidad.execute(dto);

      if (resultado.isErr) {
        const err = resultado.error as any;
        const status = err.httpStatus || 400;
        log.warn('controller', 'Error al crear especialidad', { error: { message: err.message, httpStatus: status } });
        res.status(status).json({
          success: false,
          error: { codigo: err.codigo || 'ERROR', mensaje: err.message },
        });
        return;
      }

      log.info('controller', 'Especialidad creada exitosamente', { output: { especialidadId: resultado.value?.id } });
      res.status(201).json({ success: true, data: resultado.value });
    } catch (err) {
      if (err instanceof ZodError) {
        log.warn('controller', 'Error de validación Zod');
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
      log.error('controller', 'Error inesperado al crear especialidad', err as Error);
      next(err);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const dto = actualizarEspecialidadSchema.parse(req.body);
      const resultado = await this.actualizarEspecialidad.execute(id, dto);

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

  cambiarEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const dto = cambiarEstadoSchema.parse(req.body);
      const resultado = await this.cambiarEstadoEspecialidad.execute(id, dto);

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