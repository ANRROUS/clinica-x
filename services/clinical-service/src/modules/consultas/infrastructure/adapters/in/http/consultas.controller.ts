/**
 * ============================================================================
 * ConsultasController — Adaptador de entrada HTTP
 * ============================================================================
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import type {
  IIniciarConsultaPort,
  IFinalizarConsultaPort,
  IObtenerConsultaPort,
  IListarConsultasPacientePort,
  IListarConsultasMedicoPort,
} from '@/modules/consultas/domain/ports/in/consultas.port';

// ─── Schemas Zod ────────────────────────────────────────────────────────────

const iniciarConsultaSchema = z.object({
  pacienteId: z.string().uuid('pacienteId inválido'),
  citaId: z.string().uuid('citaId inválido').optional(),
  motivoConsulta: z.string().optional(),
});

const finalizarConsultaSchema = z.object({
  diagnostico: z.string().optional(),
  notas: z.string().optional(),
});

export class ConsultasController {
  constructor(
    private readonly iniciarConsulta: IIniciarConsultaPort,
    private readonly finalizarConsulta: IFinalizarConsultaPort,
    private readonly obtenerConsulta: IObtenerConsultaPort,
    private readonly listarConsultasPaciente: IListarConsultasPacientePort,
    private readonly listarConsultasMedico: IListarConsultasMedicoPort,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────
  private getUserId(req: Request): string {
    return (req as any).user?.sub ?? '';
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

  // ─── POST /api/medical/doctor/consultation/start ───────────────────────────
  start = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = iniciarConsultaSchema.parse(req.body);
      const medicoId = this.getUserId(req);
      const resultado = await this.iniciarConsulta.execute({
        pacienteId: body.pacienteId,
        medicoId,
        citaId: body.citaId,
        motivoConsulta: body.motivoConsulta,
      });
      this.manejarResultado(res, resultado as any, 201);
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };

  // ─── POST /api/medical/doctor/consultation/:id/finalize ───────────────────
  finalize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = finalizarConsultaSchema.parse(req.body);
      const resultado = await this.finalizarConsulta.execute(req.params.id, {
        diagnostico: body.diagnostico,
        notas: body.notas,
      });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };

  // ─── GET /api/medical/doctor/active-patient ──────────────────────────────
  activePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicoId = this.getUserId(req);
      const resultado = await this.listarConsultasMedico.execute({
        medicoId,
        estado: 'ACTIVA',
      });
      // Retornamos la primera consulta activa (o null)
      const data = resultado.isErr ? null : (resultado.value as any[])[0] ?? null;
      if (resultado.isErr) {
        this.manejarResultado(res, resultado as any);
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/medical/doctor/patients ────────────────────────────────────
  doctorPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicoId = this.getUserId(req);
      const fechaDesde = req.query.desde ? new Date(req.query.desde as string) : undefined;
      const fechaHasta = req.query.hasta ? new Date(req.query.hasta as string) : undefined;
      const resultado = await this.listarConsultasMedico.execute({
        medicoId,
        fechaDesde,
        fechaHasta,
      });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/medical/patient/history ────────────────────────────────────
  patientHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pacienteId = this.getUserId(req);
      const resultado = await this.listarConsultasPaciente.execute({
        pacienteId,
      });
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/medical/patient/consultation/:id ───────────────────────────
  patientConsultation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resultado = await this.obtenerConsulta.execute(req.params.id);
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };
}
