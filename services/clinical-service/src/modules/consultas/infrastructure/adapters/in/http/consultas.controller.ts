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
  IObtenerPacienteDetallePort,
} from '@/modules/consultas/domain/ports/in/consultas.port';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IAuthServiceClient } from '@/modules/consultas/domain/ports/out/auth-service.port';
import { toConsultaDto } from '@/modules/consultas/application/mapper';
import { parseLimaDate } from '@clinica-x/date-utils';
import { env } from '@/env';
import { logger } from '@/shared/logger';

// ─── Schemas Zod ────────────────────────────────────────────────────────────

const iniciarConsultaSchema = z.object({
  pacienteId: z.string().uuid('pacienteId inválido'),
  citaId: z.string().uuid('citaId inválido').optional(),
  motivoConsulta: z.string().optional(),
});

const ordenAnalisisSchema = z.object({
  examName: z.string().min(1, 'examName es requerido'),
  specialty: z.string().optional(),
});

const medicamentoSchema = z.object({
  name: z.string().min(1, 'name es requerido'),
  days: z.number().int().positive('days debe ser un número positivo'),
  frequency: z.string().min(1, 'frequency es requerido'),
});

const subirResultadoAnalisisSchema = z.object({
  analysisOrderId: z.string().uuid('analysisOrderId inválido'),
  archivoId: z.string().uuid('archivoId inválido'),
});

const finalizarConsultaSchema = z.object({
  diagnostico: z.string().optional(),
  notas: z.string().optional(),
  analysisOrders: z.array(ordenAnalisisSchema).optional(),
  medications: z.array(medicamentoSchema).optional(),
});

export class ConsultasController {
  constructor(
    private readonly iniciarConsulta: IIniciarConsultaPort,
    private readonly finalizarConsulta: IFinalizarConsultaPort,
    private readonly obtenerConsulta: IObtenerConsultaPort,
    private readonly listarConsultasPaciente: IListarConsultasPacientePort,
    private readonly listarConsultasMedico: IListarConsultasMedicoPort,
    private readonly obtenerPacienteDetalle: IObtenerPacienteDetallePort,
    private readonly consultaRepository: IConsultaRepository,
    private readonly authServiceClient: IAuthServiceClient,
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
        analysisOrders: body.analysisOrders,
        medications: body.medications,
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
      const fechaDesde = req.query.desde ? parseLimaDate(req.query.desde as string + 'T00:00:00') : undefined;
      const fechaHasta = req.query.hasta ? parseLimaDate(req.query.hasta as string + 'T23:59:59.999') : undefined;
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

  // ─── GET /api/medical/doctor/patients/:patientId ─────────────────────────
  patientDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicoId = this.getUserId(req);
      const { patientId } = req.params;
      const resultado = await this.obtenerPacienteDetalle.execute(medicoId, patientId);
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── POST /api/medical/patient/analysis-results ──────────────────────────
  uploadAnalysisResult = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pacienteId = this.getUserId(req);
      const body = subirResultadoAnalisisSchema.parse(req.body);

      // Verificar que la orden de análisis pertenece al paciente
      const orden = await this.consultaRepository.buscarOrdenAnalisisPorId(body.analysisOrderId);
      if (!orden) {
        res.status(404).json({ success: false, error: { codigo: 'NO_ENCONTRADO', mensaje: 'Orden de análisis no encontrada' } });
        return;
      }

      const consulta = await this.consultaRepository.buscarPorId(orden.consultaId);
      if (!consulta || consulta.pacienteId !== pacienteId) {
        res.status(403).json({ success: false, error: { codigo: 'NO_AUTORIZADO', mensaje: 'No autorizado' } });
        return;
      }

      await this.consultaRepository.actualizarOrdenAnalisis(body.analysisOrderId, {
        archivoId: body.archivoId,
        estado: 'COMPLETADA',
      });

      res.status(200).json({ success: true, data: { message: 'Resultado subido correctamente' } });

      this.dispararOcrBackground(orden, pacienteId, body.archivoId).catch((err) => {
        logger.error({ err, archivoId: body.archivoId }, 'Error en OCR background');
      });
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };

  // ─── GET /api/medical/doctor/patient/:patientId/history ─────────────────
  doctorPatientHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patientId } = req.params;
      const fechaDesde = req.query.desde ? parseLimaDate(req.query.desde as string + 'T00:00:00') : undefined;
      const fechaHasta = req.query.hasta ? parseLimaDate(req.query.hasta as string + 'T23:59:59.999') : undefined;
      const consultas = await this.consultaRepository.listar({ pacienteId: patientId, estado: 'FINALIZADA', fechaDesde, fechaHasta });

      const medicoIds = [...new Set(consultas.map((c) => c.medicoId))];
      let medicosMap = new Map<string, { nombre: string; apellido: string }>();
      try {
        const medicos = await this.authServiceClient.obtenerUsuariosPorIds(medicoIds);
        medicos.forEach((m) => medicosMap.set(m.id, m));
      } catch { }

      const dtos = consultas.map((c) => {
        const medico = medicosMap.get(c.medicoId);
        return toConsultaDto(c, { medicoNombre: medico?.nombre, medicoApellido: medico?.apellido });
      });

      res.status(200).json({ success: true, data: { consultations: dtos } });
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/medical/doctor/patient/:patientId/analysis-results ────────
  patientAnalysisResults = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patientId } = req.params;
      const biomarcador = req.query.biomarcador as string | undefined;
      const results = await this.consultaRepository.buscarResultadosAnalisisPorPaciente(patientId, biomarcador);
      res.status(200).json({ success: true, data: { results } });
    } catch (err) {
      next(err);
    }
  };

  // ─── GET /api/medical/doctor/patient/:patientId/medications ────────────
  patientMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patientId } = req.params;
      const consultas = await this.consultaRepository.listar({ pacienteId: patientId, estado: 'FINALIZADA' });
      const medications: Array<{ name: string; days: number; frequency: string; fechaConsulta: string }> = [];
      for (const c of consultas) {
        for (const m of c.medicamentos) {
          medications.push({
            name: m.nombre,
            days: m.dias,
            frequency: m.frecuencia,
            fechaConsulta: c.fechaInicio?.toISOString() ?? new Date().toISOString(),
          });
        }
      }
      res.status(200).json({ success: true, data: { medications } });
    } catch (err) {
      next(err);
    }
  };

  private async dispararOcrBackground(
    orden: { id: string; tipoAnalisis: string },
    pacienteId: string,
    archivoId: string,
  ): Promise<void> {
    const ocrUrl = `${env.OCR_SERVICE_URL}/api/ocr/process`;
    const payload = {
      archivoId,
      ordenAnalisisId: orden.id,
      pacienteId,
      tipoAnalisis: orden.tipoAnalisis || 'SANGRE',
    };

    logger.info({ ocrUrl, payload }, 'Disparando OCR background');

    const response = await fetch(ocrUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': env.INTERNAL_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      logger.error({ status: response.status, payload }, 'OCR service responded with error');
    } else {
      logger.info({ archivoId }, 'OCR processing completed successfully');
    }
  }
}
