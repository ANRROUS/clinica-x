/**
 * ============================================================================
 * PrismaArchivoRepository — Adaptador de persistencia
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import { Archivo } from '@/modules/archivos/domain/entities/archivo.entity';
import type { IArchivoRepository } from '@/modules/archivos/domain/ports/out/archivo.repository.port';

export class PrismaArchivoRepository implements IArchivoRepository {
  async guardar(archivo: Archivo): Promise<Archivo> {
    const data = {
      id: archivo.id,
      propietarioServicio: archivo.propietarioServicio,
      propietarioRecursoId: archivo.propietarioRecursoId,
      bucket: archivo.bucket,
      keyS3: archivo.keyS3,
      nombreOriginal: archivo.nombreOriginal,
      mimeType: archivo.mimeType,
      tamanoBytes: archivo.tamanoBytes,
      subidoEn: new Date(),
    };

    const registro = await prisma.archivo.upsert({
      where: { id: archivo.id },
      update: data,
      create: data,
    });

    return this.toEntity(registro);
  }

  async buscarPorId(id: string): Promise<Archivo | null> {
    const registro = await prisma.archivo.findUnique({ where: { id } });
    if (!registro) return null;
    return this.toEntity(registro);
  }

  async eliminar(id: string): Promise<void> {
    await prisma.archivo.delete({ where: { id } });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private toEntity(registro: any): Archivo {
    const resultado = Archivo.create(registro.id, {
      propietarioServicio: registro.propietarioServicio,
      propietarioRecursoId: registro.propietarioRecursoId,
      bucket: registro.bucket,
      keyS3: registro.keyS3,
      nombreOriginal: registro.nombreOriginal,
      mimeType: registro.mimeType,
      tamanoBytes: registro.tamanoBytes,
    });
    if (resultado.isErr) {
      throw resultado.error;
    }
    return resultado.value;
  }
}
