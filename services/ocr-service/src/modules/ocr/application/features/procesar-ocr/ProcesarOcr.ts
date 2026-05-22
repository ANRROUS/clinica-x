import type { TipoAnalisis } from '@clinica-x/shared-types';
import { logger } from '../../../../../shared/logger';
import type { OcrProcessor } from '../../../infrastructure/adapters/out/ocr-space/OcrSpaceAdapter';
import type { FileFetcher } from '../../../infrastructure/adapters/out/storage/SupabaseFileFetcher';
import type { AnalisisRepository } from '../../../infrastructure/adapters/out/persistence/PrismaAnalisisRepository';
import { OcrParser } from './OcrParser';

export interface ProcesarOcrInput {
  archivoId: string;
  keyS3?: string;
  ordenAnalisisId: string;
  pacienteId: string;
  tipoAnalisis: TipoAnalisis;
  consultaId?: string;
}

export class ProcesarOcr {
  constructor(
    private readonly ocrProcessor: OcrProcessor,
    private readonly fileFetcher: FileFetcher,
    private readonly repository: AnalisisRepository,
    private readonly parser: OcrParser,
  ) {}

  async execute(input: ProcesarOcrInput): Promise<string> {
    logger.info({ archivoId: input.archivoId, tipo: input.tipoAnalisis }, 'Iniciando procesamiento OCR');

    const { buffer, filename } = await this.fileFetcher.download(input.archivoId, input.keyS3 || input.archivoId);

    const maxSize = 1 * 1024 * 1024;
    if (buffer.length > maxSize) {
      throw new Error(`El archivo excede el límite de 1MB para OCR gratuito. Tamaño: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
    }

    const ocrResponse = await this.ocrProcessor.process(buffer, filename);

    const rawJson = JSON.stringify(ocrResponse);
    const { header, grupos } = this.parser.parse(rawJson, input.tipoAnalisis);

    const resultId = await this.repository.createResultado({
      ordenAnalisisId: input.ordenAnalisisId,
      pacienteId: input.pacienteId,
      archivoId: input.archivoId,
      consultaId: input.consultaId,
      tipoAnalisis: input.tipoAnalisis,
      resultadoIdOriginal: header.resultadoIdOriginal,
      laboratorio: header.laboratorio,
      medicoSolicitante: header.medicoSolicitante,
      fechaToma: header.fechaToma ? new Date(header.fechaToma) : undefined,
      horaToma: header.horaToma,
      fechaResultado: header.fechaResultado ? new Date(header.fechaResultado) : undefined,
      datosMuestra: header.datosMuestra,
      pacienteNombreOcr: header.pacienteNombreOcr,
      pacienteIdOcr: header.pacienteIdOcr,
      pacienteSexo: header.pacienteSexo,
      pacienteEdad: header.pacienteEdad,
      grupos: grupos.map((g) => ({
        nombreGrupo: g.nombreGrupo,
        orden: g.orden,
        items: g.items.map((item) => ({
          nombre: item.nombre,
          valor: item.valor,
          unidad: item.unidad,
          rangoMin: item.rangoMin,
          rangoMax: item.rangoMax,
          rangoReferencia: item.rangoReferencia,
          estado: item.estado,
          nota: item.nota,
          orden: item.orden,
        })),
      })),
    });

    await this.repository.markCompleted(resultId);

    return resultId;
  }
}
