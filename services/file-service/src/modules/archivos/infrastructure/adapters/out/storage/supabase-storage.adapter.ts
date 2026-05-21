import { env } from '@/env';
import { logger } from '@/shared/logger';
import type { IStoragePort } from '@/modules/archivos/domain/ports/out/storage.port';

const STORAGE_BASE = `${env.SUPABASE_URL}/storage/v1`;

export class SupabaseStorageAdapter implements IStoragePort {
  async inicializar(): Promise<void> {
    const path = '/bucket';
    const res = await this.request('POST', path, {
      body: JSON.stringify({
        name: env.SUPABASE_BUCKET,
        public: false,
      }),
      contentType: 'application/json',
    });

    if (res.status === 409) {
      logger.info(`Bucket "${env.SUPABASE_BUCKET}" ya existe`);
      return;
    }

    if (!res.ok) {
      const text = await res.text();
      logger.warn({ status: res.status, response: text }, 'No se pudo crear el bucket (posible falta de permisos)');
      return;
    }

    logger.info(`Bucket "${env.SUPABASE_BUCKET}" creado correctamente`);
  }
  private async request(
    method: string,
    path: string,
    options?: { body?: any; contentType?: string },
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    };
    if (options?.contentType) {
      headers['Content-Type'] = options.contentType;
    }
    return fetch(`${STORAGE_BASE}${path}`, {
      method,
      headers,
      body: options?.body,
    });
  }

  async subir(key: string, buffer: Buffer, mimeType: string): Promise<void> {
    const path = `/object/${env.SUPABASE_BUCKET}/${key}`;
    const res = await this.request('POST', path, {
      body: buffer,
      contentType: mimeType,
    });
    if (!res.ok) {
      const text = await res.text();
      logger.error({ status: res.status, response: text, key }, 'Supabase upload failed');
      throw new Error(`Error al subir archivo a Supabase: ${res.status} ${text}`);
    }
  }

  async generarUrlFirmada(key: string, expiraSegundos = 3600): Promise<string> {
    const path = `/object/sign/${env.SUPABASE_BUCKET}/${key}`;
    const res = await this.request('POST', path, {
      body: JSON.stringify({ expiresIn: expiraSegundos }),
      contentType: 'application/json',
    });
    if (!res.ok) {
      const text = await res.text();
      logger.error({ status: res.status, response: text, key }, 'Supabase signed URL failed');
      throw new Error(`Error al generar URL firmada en Supabase: ${res.status} ${text}`);
    }
    const data = (await res.json()) as { signedURL: string } | { signedUrl: string };
    const signedURL = 'signedURL' in data ? data.signedURL : (data as any).signedUrl;
    return signedURL;
  }

  async eliminar(key: string): Promise<void> {
    const path = `/object/${env.SUPABASE_BUCKET}/${key}`;
    const res = await this.request('DELETE', path, {
      body: JSON.stringify({ prefixes: [key] }),
      contentType: 'application/json',
    });
    if (!res.ok) {
      const text = await res.text();
      logger.error({ status: res.status, response: text, key }, 'Supabase delete failed');
      throw new Error(`Error al eliminar archivo de Supabase: ${res.status} ${text}`);
    }
  }
}
