import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import type { ProcesarOcr } from '../../../../application/features/procesar-ocr/ProcesarOcr';
import type { ObtenerResultado } from '../../../../application/features/obtener-resultado/ObtenerResultado';
import { logger } from '@/shared/logger';

export class OcrController {
  constructor(
    private readonly procesarOcr: ProcesarOcr,
    private readonly obtenerResultado: ObtenerResultado,
  ) {}

  procesar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { archivoId, ordenAnalisisId, pacienteId, tipoAnalisis, consultaId } = req.body;

      if (!archivoId || !ordenAnalisisId || !pacienteId || !tipoAnalisis) {
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDATION_ERROR',
            mensaje: 'Faltan campos requeridos: archivoId, ordenAnalisisId, pacienteId, tipoAnalisis',
          },
        });
        return;
      }

      const VALID_TIPOS = ['SANGRE', 'ORINA', 'HECES'];
      if (!VALID_TIPOS.includes(tipoAnalisis)) {
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDATION_ERROR',
            mensaje: `tipoAnalisis inválido. Debe ser: ${VALID_TIPOS.join(', ')}`,
          },
        });
        return;
      }

      const resultId = await this.procesarOcr.execute({
        archivoId,
        ordenAnalisisId,
        pacienteId,
        tipoAnalisis,
        consultaId,
      });

      res.json({
        success: true,
        data: {
          id: resultId,
          archivoId,
          estadoOcr: 'COMPLETADO',
        },
      });
    } catch (error) {
      logger.error({ error }, 'Error en procesar OCR');
      next(error);
    }
  };

  obtenerPorArchivo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { archivoId } = req.params;
      const result = await this.obtenerResultado.byArchivoId(archivoId);
      if (!result) {
        res.status(404).json({
          success: false,
          error: { codigo: 'NOT_FOUND', mensaje: 'No se encontraron resultados OCR para este archivo' },
        });
        return;
      }
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  obtenerPorOrden = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ordenAnalisisId } = req.params;
      const result = await this.obtenerResultado.byOrdenAnalisisId(ordenAnalisisId);
      if (!result) {
        res.status(404).json({
          success: false,
          error: { codigo: 'NOT_FOUND', mensaje: 'No se encontraron resultados OCR para esta orden' },
        });
        return;
      }
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  listarPorPaciente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { pacienteId } = req.params;
      const results = await this.obtenerResultado.listByPacienteId(pacienteId);
      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  };

  procesarAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { archivoId, keyS3, tipoAnalisis, pacienteId, ordenAnalisisId, consultaId } = req.body;

      if (!archivoId || !keyS3 || !tipoAnalisis || !pacienteId) {
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDATION_ERROR',
            mensaje: 'Faltan campos requeridos: archivoId, keyS3, tipoAnalisis, pacienteId',
          },
        });
        return;
      }

      const VALID_TIPOS = ['SANGRE', 'ORINA', 'HECES'];
      if (!VALID_TIPOS.includes(tipoAnalisis)) {
        res.status(400).json({
          success: false,
          error: {
            codigo: 'VALIDATION_ERROR',
            mensaje: `tipoAnalisis inválido. Debe ser: ${VALID_TIPOS.join(', ')}`,
          },
        });
        return;
      }

      const dummyOrdenId = ordenAnalisisId || randomUUID();

      const resultId = await this.procesarOcr.execute({
        archivoId,
        keyS3,
        ordenAnalisisId: dummyOrdenId,
        pacienteId,
        tipoAnalisis,
        consultaId,
      });

      res.json({
        success: true,
        data: {
          id: resultId,
          archivoId,
          estadoOcr: 'COMPLETADO',
        },
      });
    } catch (error) {
      logger.error({ error }, 'Error en procesar OCR admin');
      next(error);
    }
  };

  status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { archivoId } = req.params;
      const result = await this.obtenerResultado.byArchivoId(archivoId);
      if (!result) {
        res.json({
          success: true,
          data: { archivoId, estadoOcr: 'NO_PROCESADO' },
        });
        return;
      }
      res.json({
        success: true,
        data: {
          archivoId,
          estadoOcr: result.estadoOcr,
          errorOcr: result.errorOcr,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
