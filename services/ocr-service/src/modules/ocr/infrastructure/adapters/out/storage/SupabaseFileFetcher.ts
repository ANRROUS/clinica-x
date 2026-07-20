import axios from 'axios';
import { env } from '@/env';
import { logger } from '@/shared/logger';

export interface FileFetcher {
  download(archivoId: string, keyS3: string): Promise<{ buffer: Buffer; filename: string; mimeType: string }>;
}

export class SupabaseFileFetcher implements FileFetcher {
  async download(archivoId: string, keyS3: string): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
    logger.info({ archivoId, keyS3 }, 'Descargando archivo desde Supabase Storage');

    const SAFE_KEY_PATTERN = /^[a-zA-Z0-9_\-\/]+$/;
    if (!SAFE_KEY_PATTERN.test(keyS3) || keyS3.includes('..')) {
      throw new Error('keyS3 contiene caracteres no permitidos');
    }

    const url = `${env.SUPABASE_URL}/storage/v1/object/${env.SUPABASE_BUCKET}/${keyS3}`;

    try {
      const response = await axios.get<ArrayBuffer>(url, {
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      });

      const buffer = Buffer.from(response.data);
      const contentType = (response.headers['content-type'] as string) || 'application/pdf';

      logger.info({ archivoId, keyS3, size: buffer.length, mimeType: contentType }, 'Archivo descargado correctamente');

      return {
        buffer,
        filename: keyS3.split('/').pop() || archivoId,
        mimeType: contentType,
      };
    } catch (error: any) {
      const status = error.response?.status;
      logger.error({ error: error.message, status, archivoId, keyS3 }, 'Error descargando archivo de Supabase');

      if (status === 404) {
        throw new Error(`Archivo no encontrado en Supabase Storage: ${keyS3}. Verifica que el archivo se subió correctamente.`);
      }
      if (status === 403 || status === 401) {
        throw new Error(`Sin permisos para acceder al archivo en Supabase Storage: ${keyS3}. Verifica SUPABASE_SERVICE_ROLE_KEY.`);
      }
      throw new Error(`Error descargando archivo de Supabase Storage (${status || 'sin status'}): ${error.message}`);
    }
  }
}
