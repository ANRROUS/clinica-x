/**
 * ============================================================================
 * Port de salida — Repositorio de archivos
 * ============================================================================
 */

import type { Archivo } from '../../entities/archivo.entity';

export interface IArchivoRepository {
  guardar(archivo: Archivo): Promise<Archivo>;
  buscarPorId(id: string): Promise<Archivo | null>;
  eliminar(id: string): Promise<void>;
}
