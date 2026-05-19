/**
 * ============================================================================
 * S3StorageAdapter — Adaptador de almacenamiento AWS S3
 * ============================================================================
 */

import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, S3_BUCKET } from '@/shared/s3-client';
import type { IStoragePort } from '@/modules/archivos/domain/ports/out/storage.port';

export class S3StorageAdapter implements IStoragePort {
  async subir(key: string, buffer: Buffer, mimeType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });
    await s3.send(command);
  }

  async generarUrlFirmada(key: string, expiraSegundos = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    return getSignedUrl(s3, command, { expiresIn: expiraSegundos });
  }

  async eliminar(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    await s3.send(command);
  }
}
