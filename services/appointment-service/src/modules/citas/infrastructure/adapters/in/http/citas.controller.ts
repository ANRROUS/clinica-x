/**
 * ============================================================================
 * CitasController — Adaptador de entrada HTTP
 * ============================================================================
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import type {
  ICrearCitaPort,
  ICancelarCitaPort,
  IReprogramarCitaPort,
  IListarCitasPacientePort,
  IListarCitasMedicoPort,
  IObtenerDisponibilidadPort,
  IObtenerDisponibilidadPorEspecialidadPort,
  ICambiarEstadoCitaPort,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { nowLima, parseLimaDate, formatLima } from '@clinica-x/date-utils';

// ─── Schemas Zod ────────────────────────────────────────────────────────────

const crearCitaSchema = z.object({
  medicoId: z.string().uuid('medicoId inválido'),
  fechaHora: z.string().datetime({ message: 'fechaHora debe ser ISO 8601' }),
  motivo: z.string().optional(),
});

const reprogramarCitaSchema = z.object({
  fechaHora: z.string().datetime({ message: 'fechaHora debe ser ISO 8601' }),
});

const cambiarEstadoSchema = z.object({
  estado: z.enum(['CONFIRMADA', 'EN_ATENCION', 'COMPLETADA', 'CANCELADA']),
});

export class CitasController {
  constructor(
    private readonly crearCita: ICrearCitaPort,
    private readonly crearCitaAutomatica: ICrearCitaPort,
    private readonly cancelarCita: ICancelarCitaPort,
    private readonly reprogramarCita: IReprogramarCitaPort,
    private readonly listarCitasPaciente: IListarCitasPacientePort,
    private readonly listarCitasMedico: IListarCitasMedicoPort,
    private readonly obtenerDisponibilidad: IObtenerDisponibilidadPort,
    private readonly obtenerDisponibilidadPorEspecialidad: IObtenerDisponibilidadPorEspecialidadPort,
    private readonly cambiarEstadoCita: ICambiarEstadoCitaPort,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────
  private getPacienteId(req: Request): string {
    return (req as any).user?.sub ?? '';
  }

  private async getMedicoId(req: Request): Promise<string | null> {
    const usuarioId = (req as any).user?.sub;
    if (!usuarioId) return null;
    const medico = await this.medicoReader.buscarPorUsuarioId(usuarioId);
    return medico?.id ?? null;
  }

  private manejarResultado(res: Response, resultado: { isErr: boolean; error?: Error; value?: any }, statusOk = 200): boolean {
    if (resultado.isErr) {
      const err = resultado.error as any;
      const status = err.httpStatus || 400;
      res.status(status).json({
        success: false,
        error: { codigo: err.codigo || 'ERROR', mensaje: err.message },
      });
      return false;
    }
    res.status(statusOk).json({ success: true, data: resultado.value });
    return true;
  }

  private manejarZodError(res: Response, err: ZodError): void {
    res.status(400).json({
      success: false,
      error: {
        codigo: 'VALIDACION',
        mensaje: 'Datos inválidos',
        detalles: err.errors.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
      },
    });
  }

  // ─── GET /api/appointments/specialties ────────────────────────────────────
  listarEspecialidades = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const especialidades = await this.medicoReader.listarEspecialidades();
      res.status(200).json({ success: true, data: especialidades });
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/appointments/availability?medicoId=&fecha= ────────────────────
  disponibilidad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicoId = req.query.medicoId as string;
      const fechaStr = req.query.fecha as string;
      if (!medicoId || !fechaStr) {
        res.status(400).json({ success: false, error: { codigo: 'VALIDACION', mensaje: 'medicoId y fecha son requeridos' } });
        return;
      }
      const fecha = parseLimaDate(fechaStr + 'T00:00:00');
      const resultado = await this.obtenerDisponibilidad.execute({ medicoId, fecha });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/appointments/availability/specialty/:especialidadId ──────────
  disponibilidadPorEspecialidad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const especialidadId = req.params.especialidadId;
      const resultado = await this.obtenerDisponibilidadPorEspecialidad.execute({
        especialidadId,
        fechaDesde: nowLima(),
      });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── POST /api/appointments/book/manual ───────────────────────────────────
  reservarManual = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = crearCitaSchema.parse(req.body);
      const pacienteId = this.getPacienteId(req);
      const resultado = await this.crearCita.execute({
        pacienteId,
        medicoId: body.medicoId,
        fechaHora: parseLimaDate(body.fechaHora),
        tipoReserva: 'MANUAL',
        motivo: body.motivo,
      });
      this.manejarResultado(res, resultado as any, 201);
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };

  // ─── POST /api/appointments/book/automatic ────────────────────────────────
  reservarAutomatica = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schema = z.object({ especialidadId: z.string().uuid(), motivo: z.string().optional() });
      const body = schema.parse(req.body);
      const pacienteId = this.getPacienteId(req);
      const resultado = await this.crearCitaAutomatica.execute({
        pacienteId,
        medicoId: body.especialidadId, // En automática usamos medicoId del DTO como especialidadId
        fechaHora: nowLima(), // Ignorado en automática
        tipoReserva: 'AUTOMATICA',
        motivo: body.motivo,
      });
      this.manejarResultado(res, resultado as any, 201);
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };

  // ─── GET /api/appointments/patient/me ─────────────────────────────────────
  listarPaciente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pacienteId = this.getPacienteId(req);
      const resultado = await this.listarCitasPaciente.execute({ pacienteId });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── PUT /api/appointments/patient/:id ────────────────────────────────────
  reprogramar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = reprogramarCitaSchema.parse(req.body);
      const pacienteId = this.getPacienteId(req);
      const resultado = await this.reprogramarCita.execute(req.params.id, {
        pacienteId,
        nuevaFechaHora: parseLimaDate(body.fechaHora),
      });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };

  // ─── DELETE /api/appointments/patient/:id ─────────────────────────────────
  cancelar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pacienteId = this.getPacienteId(req);
      const resultado = await this.cancelarCita.execute(req.params.id, { pacienteId });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/appointments/doctor/calendar ──────────────────────────────────
  calendarioMedico = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicoId = await this.getMedicoId(req);
      if (!medicoId) {
        res.status(404).json({ success: false, error: { codigo: 'MEDICO_NO_ENCONTRADO', mensaje: 'No se encontró médico asociado al usuario' } });
        return;
      }
      const fechaDesde = req.query.desde ? parseLimaDate(req.query.desde as string + 'T00:00:00') : undefined;
      const fechaHasta = req.query.hasta ? parseLimaDate(req.query.hasta as string + 'T23:59:59.999') : undefined;
      const resultado = await this.listarCitasMedico.execute({ medicoId, fechaDesde, fechaHasta });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── PATCH /api/appointments/doctor/:id/status ─────────────────────────────
  cambiarEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = cambiarEstadoSchema.parse(req.body);
      const resultado = await this.cambiarEstadoCita.execute(req.params.id, { estado: body.estado });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };
}
