/**
 * ============================================================================
 * Caso de uso — Obtener URL Firmada
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import { ArchivoNoEncontradoError } from '@/modules/archivos/domain/exceptions/archivo.errors';
import type { IArchivoRepository } from '@/modules/archivos/domain/ports/out/archivo.repository.port';
import type { IStoragePort } from '@/modules/archivos/domain/ports/out/storage.port';
import type { IObtenerUrlFirmadaPort } from '@/modules/archivos/domain/ports/in/archivos.port';

export class ObtenerUrlFirmadaUseCase implements IObtenerUrlFirmadaPort {
  constructor(
    private readonly repository: IArchivoRepository,
    private readonly storage: IStoragePort,
  ) {}

  async execute(archivoId: string): Promise<Result<{ url: string; expiraEn: number }, Error>> {
    const archivo = await this.repository.buscarPorId(archivoId);
    if (!archivo) {
      return Err(new ArchivoNoEncontradoError());
    }

    const expiraSegundos = 3600;
    const url = await this.storage.generarUrlFirmada(archivo.keyS3, expiraSegundos);
    return Ok({ url, expiraEn: expiraSegundos });
  }
}
