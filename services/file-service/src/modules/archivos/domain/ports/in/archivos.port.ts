/**
 * ============================================================================
 * Ports de entrada (contratos de use cases) — módulo archivos
 * ============================================================================
 */

import type { Result } from '@clinica-x/shared-kernel';

// ─── DTOs de entrada ─────────────────────────────────────────────────────────

export interface SubirArchivoDto {
  propietarioServicio: string;
  propietarioRecursoId: string;
  nombreOriginal: string;
  mimeType: string;
  tamanoBytes: number;
  buffer: Buffer;
}

// ─── DTOs de salida ─────────────────────────────────────────────────────────

export interface ArchivoDto {
  id: string;
  propietarioServicio: string;
  propietarioRecursoId: string;
  nombreOriginal: string;
  mimeType: string;
  tamanoBytes: number;
  urlFirmada: string;
  subidoEn: string;
}

// ─── Contratos de use cases ─────────────────────────────────────────────────

export interface ISubirArchivoPort {
  execute(dto: SubirArchivoDto): Promise<Result<ArchivoDto, Error>>;
}

export interface IObtenerUrlFirmadaPort {
  execute(archivoId: string): Promise<Result<{ url: string; expiraEn: number }, Error>>;
}

export interface IEliminarArchivoPort {
  execute(archivoId: string): Promise<Result<void, Error>>;
}
