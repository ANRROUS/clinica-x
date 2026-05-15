/**
 * ============================================================================
 * Caso de uso — Eliminar Archivo
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import { ArchivoNoEncontradoError } from '@/modules/archivos/domain/exceptions/archivo.errors';
import type { IArchivoRepository } from '@/modules/archivos/domain/ports/out/archivo.repository.port';
import type { IStoragePort } from '@/modules/archivos/domain/ports/out/storage.port';
import type { IEliminarArchivoPort } from '@/modules/archivos/domain/ports/in/archivos.port';

export class EliminarArchivoUseCase implements IEliminarArchivoPort {
  constructor(
    private readonly repository: IArchivoRepository,
    private readonly storage: IStoragePort,
  ) {}

  async execute(archivoId: string): Promise<Result<void, Error>> {
    const archivo = await this.repository.buscarPorId(archivoId);
    if (!archivo) {
      return Err(new ArchivoNoEncontradoError());
    }

    await this.storage.eliminar(archivo.keyS3);
    await this.repository.eliminar(archivoId);
    return Ok(undefined);
  }
}
