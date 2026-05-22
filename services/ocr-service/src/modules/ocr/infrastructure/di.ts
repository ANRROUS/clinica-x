import { OcrController } from './adapters/in/http/ocr.controller';
import { createOcrRouter } from './adapters/in/http/ocr.router';
import { OcrSpaceAdapter } from './adapters/out/ocr-space/OcrSpaceAdapter';
import { SupabaseFileFetcher } from './adapters/out/storage/SupabaseFileFetcher';
import { PrismaAnalisisRepository } from './adapters/out/persistence/PrismaAnalisisRepository';
import { ProcesarOcr } from '../application/features/procesar-ocr/ProcesarOcr';
import { ObtenerResultado } from '../application/features/obtener-resultado/ObtenerResultado';
import { OcrParser } from '../application/features/procesar-ocr/OcrParser';

function buildController(): OcrController {
  const ocrProcessor = new OcrSpaceAdapter();
  const fileFetcher = new SupabaseFileFetcher();
  const repository = new PrismaAnalisisRepository();
  const parser = new OcrParser();

  const procesarOcr = new ProcesarOcr(ocrProcessor, fileFetcher, repository, parser);
  const obtenerResultado = new ObtenerResultado(repository);

  return new OcrController(procesarOcr, obtenerResultado);
}

const controller = buildController();
export const ocrRouter = createOcrRouter(controller);
