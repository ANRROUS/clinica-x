/**
 * ============================================================================
 * Mapper — Entidad Archivo ↔ DTOs planos
 * ============================================================================
 */

import type { Archivo } from '@/modules/archivos/domain/entities/archivo.entity';
import type { ArchivoDto } from '@/modules/archivos/domain/ports/in/archivos.port';
import { nowLima } from '@clinica-x/date-utils';

export function toArchivoDto(archivo: Archivo, urlFirmada: string): ArchivoDto {
  return {
    id: archivo.id,
    propietarioServicio: archivo.propietarioServicio,
    propietarioRecursoId: archivo.propietarioRecursoId,
    nombreOriginal: archivo.nombreOriginal,
    mimeType: archivo.mimeType,
    tamanoBytes: archivo.tamanoBytes,
    keyS3: archivo.keyS3,
    urlFirmada,
    subidoEn: nowLima().toISOString(), // Prisma no expone esto directamente en la entidad
  };
}
