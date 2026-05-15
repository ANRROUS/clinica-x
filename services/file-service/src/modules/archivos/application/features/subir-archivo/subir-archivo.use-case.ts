/**
 * ============================================================================
 * Caso de uso — Subir Archivo
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import { Archivo } from '@/modules/archivos/domain/entities/archivo.entity';
import { TipoMimeNoPermitidoError, TamanoArchivoExcedidoError } from '@/modules/archivos/domain/exceptions/archivo.errors';
import type { IArchivoRepository } from '@/modules/archivos/domain/ports/out/archivo.repository.port';
import type { IStoragePort } from '@/modules/archivos/domain/ports/out/storage.port';
import type { ISubirArchivoPort, ArchivoDto, SubirArchivoDto } from '@/modules/archivos/domain/ports/in/archivos.port';
import { toArchivoDto } from '../../mapper';
import { env } from '@/env';

export class SubirArchivoUseCase implements ISubirArchivoPort {
  constructor(
    private readonly repository: IArchivoRepository,
    private readonly storage: IStoragePort,
  ) {}

  async execute(dto: SubirArchivoDto): Promise<Result<ArchivoDto, Error>> {
    // Validar MIME type
    if (!env.ALLOWED_MIME_TYPES.includes(dto.mimeType)) {
      return Err(new TipoMimeNoPermitidoError(dto.mimeType));
    }

    // Validar tamaño
    if (dto.tamanoBytes > env.MAX_FILE_SIZE_BYTES) {
      return Err(new TamanoArchivoExcedidoError(env.MAX_FILE_SIZE_BYTES));
    }

    const keyS3 = `${dto.propietarioServicio}/${dto.propietarioRecursoId}/${crypto.randomUUID()}-${dto.nombreOriginal}`;

    const resultado = Archivo.create(crypto.randomUUID(), {
      propietarioServicio: dto.propietarioServicio,
      propietarioRecursoId: dto.propietarioRecursoId,
      bucket: env.AWS_BUCKET,
      keyS3,
      nombreOriginal: dto.nombreOriginal,
      mimeType: dto.mimeType,
      tamanoBytes: dto.tamanoBytes,
    });

    if (resultado.isErr) {
      return Err(resultado.error);
    }

    const archivo = resultado.value;

    // Subir a S3
    await this.storage.subir(keyS3, dto.buffer, dto.mimeType);

    // Guardar en DB
    const guardado = await this.repository.guardar(archivo);

    // Generar URL firmada
    const urlFirmada = await this.storage.generarUrlFirmada(keyS3, 3600);

    return Ok(toArchivoDto(guardado, urlFirmada));
  }
}
