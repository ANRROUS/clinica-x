import axios from 'axios';
import FormData from 'form-data';
import { env } from '@/env';
import { logger } from '@/shared/logger';
import type { OcrSpaceResponse } from '../../../../application/features/procesar-ocr/OcrParser';

export interface OcrProcessor {
  process(pdfBuffer: Buffer, filename: string): Promise<OcrSpaceResponse>;
}

export class OcrSpaceAdapter implements OcrProcessor {
  async process(pdfBuffer: Buffer, filename: string): Promise<OcrSpaceResponse> {
    const form = new FormData();
    form.append('file', pdfBuffer, {
      filename,
      contentType: 'application/pdf',
    });
    form.append('language', env.OCR_SPACE_LANGUAGE);
    form.append('OCREngine', String(env.OCR_SPACE_ENGINE));
    form.append('isOverlayRequired', 'true');
    form.append('isTable', 'true');
    form.append('scale', 'true');
    form.append('detectOrientation', 'true');
    form.append('filetype', 'PDF');

    logger.info({ filename, size: pdfBuffer.length }, 'Enviando PDF a OCR.space');

    let response;
    try {
      response = await axios.post<OcrSpaceResponse>(env.OCR_SPACE_API_URL, form, {
        headers: {
          ...form.getHeaders(),
          apikey: env.OCR_SPACE_API_KEY,
        },
        timeout: 120_000,
        maxContentLength: 10 * 1024 * 1024,
        maxBodyLength: 10 * 1024 * 1024,
      });
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        logger.error({ filename, timeout: 120_000 }, 'OCR.space timeout: el archivo tardó más de 120 segundos');
        throw new Error('OCR.space timeout: el procesamiento tardó demasiado. Intenta con un archivo más pequeño.');
      }
      if (err.response?.status === 401 || err.response?.status === 403) {
        logger.error({ status: err.response.status }, 'OCR.space: API key inválida o sin permisos');
        throw new Error('OCR.space: API key inválida o sin permisos.');
      }
      if (err.response?.status === 429) {
        logger.error({}, 'OCR.space: límite de requests alcanzado (rate limit)');
        throw new Error('OCR.space: se alcanzó el límite de requests. Intenta más tarde.');
      }
      logger.error({ error: err.message, status: err.response?.status }, 'Error comunicándose con OCR.space');
      throw new Error(`Error comunicándose con OCR.space: ${err.message}`);
    }

    const data = response.data;

    if (data.IsErroredOnProcessing) {
      logger.error(
        {
          exitCode: data.OCRExitCode,
          error: data.ErrorMessage,
          details: data.ErrorDetails,
          parsedResults: data.ParsedResults?.map((r) => ({
            exitCode: r.FileParseExitCode,
            error: r.ErrorMessage,
            details: r.ErrorDetails,
          })),
        },
        'OCR.space error de procesamiento',
      );
      throw new Error(`OCR.space error: ${data.ErrorMessage || data.ErrorDetails || 'Error desconocido'}`);
    }

    const hasPartialErrors = data.ParsedResults?.some((r) => r.FileParseExitCode !== 1);
    if (hasPartialErrors) {
      logger.warn(
        {
          exitCode: data.OCRExitCode,
          pageResults: data.ParsedResults?.map((r) => ({
            exitCode: r.FileParseExitCode,
            error: r.ErrorMessage,
          })),
        },
        'OCR.space: algunas páginas tuvieron errores parciales',
      );
    }

    logger.info(
      {
        processingTime: data.ProcessingTimeInMilliseconds,
        pages: data.ParsedResults?.length,
        exitCode: data.OCRExitCode,
      },
      'OCR.space respuesta recibida',
    );

    return data;
  }
}
