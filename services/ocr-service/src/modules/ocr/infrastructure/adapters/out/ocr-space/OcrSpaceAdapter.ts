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

    logger.info({ filename, size: pdfBuffer.length }, 'Enviando PDF a OCR.space');

    const response = await axios.post<OcrSpaceResponse>(env.OCR_SPACE_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        apikey: env.OCR_SPACE_API_KEY,
      },
      timeout: 60000,
    });

    const data = response.data;

    if (data.IsErroredOnProcessing) {
      logger.error({ error: data.ErrorMessage, details: data.ErrorDetails }, 'OCR.space error');
      throw new Error(`OCR.space error: ${data.ErrorMessage || 'Unknown error'}`);
    }

    logger.info({ processingTime: data.ProcessingTimeInMilliseconds, pages: data.ParsedResults?.length }, 'OCR.space respuesta recibida');

    return data;
  }
}
