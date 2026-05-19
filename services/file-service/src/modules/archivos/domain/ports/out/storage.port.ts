/**
 * ============================================================================
 * Port de salida — Adaptador de almacenamiento (S3)
 * ============================================================================
 */

export interface IStoragePort {
  subir(key: string, buffer: Buffer, mimeType: string): Promise<void>;
  generarUrlFirmada(key: string, expiraSegundos?: number): Promise<string>;
  eliminar(key: string): Promise<void>;
}
