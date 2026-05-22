import axios from 'axios';
import { env } from '@/env';
import { logger } from '@/shared/logger';

export interface FileFetcher {
  download(archivoId: string): Promise<{ buffer: Buffer; filename: string; mimeType: string }>;
}

export class SupabaseFileFetcher implements FileFetcher {
  async download(archivoId: string): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
    logger.info({ archivoId }, 'Descargando archivo desde Supabase Storage');

    const url = `${env.SUPABASE_URL}/storage/v1/object/${env.SUPABASE_BUCKET}/${archivoId}`;

    try {
      const response = await axios.get<ArrayBuffer>(url, {
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      });

      const buffer = Buffer.from(response.data);
      const contentType = (response.headers['content-type'] as string) || 'application/pdf';

      logger.info({ archivoId, size: buffer.length }, 'Archivo descargado correctamente');

      return {
        buffer,
        filename: archivoId,
        mimeType: contentType,
      };
    } catch (error) {
      logger.error({ error, archivoId }, 'Error descargando archivo de Supabase');
      throw new Error(`Error descargando archivo de Supabase Storage: ${archivoId}`);
    }
  }
}
