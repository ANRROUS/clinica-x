/**
 * ============================================================================
 * ArchivosController — Adaptador de entrada HTTP
 * ============================================================================
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import type {
  ISubirArchivoPort,
  IObtenerUrlFirmadaPort,
  IEliminarArchivoPort,
} from '@/modules/archivos/domain/ports/in/archivos.port';

// ─── Schemas Zod ────────────────────────────────────────────────────────────

const uploadMetadataSchema = z.object({
  propietarioServicio: z.string().min(1),
  propietarioRecursoId: z.string().uuid(),
});

export class ArchivosController {
  constructor(
    private readonly subirArchivo: ISubirArchivoPort,
    private readonly obtenerUrlFirmada: IObtenerUrlFirmadaPort,
    private readonly eliminarArchivo: IEliminarArchivoPort,
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

  // ─── POST /api/files/upload ───────────────────────────────────────────────
  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = (req as any).file as Express.Multer.File | undefined;
      if (!file) {
        res.status(400).json({ success: false, error: { codigo: 'ARCHIVO_REQUERIDO', mensaje: 'No se proporcionó ningún archivo' } });
        return;
      }

      const body = uploadMetadataSchema.parse(req.body);
      const resultado = await this.subirArchivo.execute({
        propietarioServicio: body.propietarioServicio,
        propietarioRecursoId: body.propietarioRecursoId,
        nombreOriginal: file.originalname,
        mimeType: file.mimetype,
        tamanoBytes: file.size,
        buffer: file.buffer,
      });
      this.manejarResultado(res, resultado as any, 201);
    } catch (err) {
      if (err instanceof ZodError) { this.manejarZodError(res, err); return; }
      next(err);
    }
  };

  // ─── GET /api/files/:id/signed-url ────────────────────────────────────────
  signedUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resultado = await this.obtenerUrlFirmada.execute(req.params.id);
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };

  // ─── DELETE /api/files/:id ────────────────────────────────────────────────
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resultado = await this.eliminarArchivo.execute(req.params.id);
      this.manejarResultado(res, resultado as any);
    } catch (err) {
      next(err);
    }
  };
}
