/**
 * ============================================================================
 * Composition Root del módulo de archivos
 * ============================================================================
 */

import { PrismaArchivoRepository } from '@/modules/archivos/infrastructure/adapters/out/persistence/prisma-archivo.repository';
import { S3StorageAdapter } from '@/modules/archivos/infrastructure/adapters/out/storage/s3-storage.adapter';
import { SubirArchivoUseCase } from '@/modules/archivos/application/features/subir-archivo/subir-archivo.use-case';
import { ObtenerUrlFirmadaUseCase } from '@/modules/archivos/application/features/obtener-url-firmada/obtener-url-firmada.use-case';
import { EliminarArchivoUseCase } from '@/modules/archivos/application/features/eliminar-archivo/eliminar-archivo.use-case';
import { ArchivosController } from '@/modules/archivos/infrastructure/adapters/in/http/archivos.controller';
import { createArchivosRouter } from '@/modules/archivos/infrastructure/adapters/in/http/archivos.router';

// ─── Adaptadores de salida ──────────────────────────────────────────────────
const archivoRepository = new PrismaArchivoRepository();
const storageAdapter = new S3StorageAdapter();

// ─── Casos de uso ───────────────────────────────────────────────────────────
const subirArchivoUseCase = new SubirArchivoUseCase(archivoRepository, storageAdapter);
const obtenerUrlFirmadaUseCase = new ObtenerUrlFirmadaUseCase(archivoRepository, storageAdapter);
const eliminarArchivoUseCase = new EliminarArchivoUseCase(archivoRepository, storageAdapter);

// ─── Controlador ────────────────────────────────────────────────────────────
const archivosController = new ArchivosController(
  subirArchivoUseCase,
  obtenerUrlFirmadaUseCase,
  eliminarArchivoUseCase,
);

// ─── Router ─────────────────────────────────────────────────────────────────
export const archivosRouter = createArchivosRouter(archivosController);
