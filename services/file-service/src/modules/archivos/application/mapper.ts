/**
 * ============================================================================
 * Mapper — Entidad Archivo ↔ DTOs planos
 * ============================================================================
 */

import type { Archivo } from '@/modules/archivos/domain/entities/archivo.entity';
import type { ArchivoDto } from '@/modules/archivos/domain/ports/in/archivos.port';

export function toArchivoDto(archivo: Archivo, urlFirmada: string): ArchivoDto {
  return {
    id: archivo.id,
    propietarioServicio: archivo.propietarioServicio,
    propietarioRecursoId: archivo.propietarioRecursoId,
    nombreOriginal: archivo.nombreOriginal,
    mimeType: archivo.mimeType,
    tamanoBytes: archivo.tamanoBytes,
    urlFirmada,
    subidoEn: new Date().toISOString(), // Prisma no expone esto directamente en la entidad
  };
}
