-- =============================================================================
-- Migración: Tablas OCR para análisis clínicos
-- =============================================================================
-- Schema: clinical_service
-- Fecha: 2026-05-21
-- =============================================================================

-- 1. Agregar columna analisisResultadoId a ordenes_analisis
ALTER TABLE "ordenes_analisis"
ADD COLUMN IF NOT EXISTS "analisisResultadoId" TEXT;

-- 2. Crear índice único en analisisResultadoId
CREATE UNIQUE INDEX IF NOT EXISTS "ordenes_analisis_analisisResultadoId_key"
ON "ordenes_analisis"("analisisResultadoId");

-- 3. Crear tabla analisis_resultados
CREATE TABLE IF NOT EXISTS "analisis_resultados" (
    "id" TEXT NOT NULL,
    "ordenAnalisisId" TEXT,
    "pacienteId" TEXT NOT NULL,
    "archivoId" TEXT NOT NULL,
    "consultaId" TEXT,
    "tipoAnalisis" TEXT NOT NULL,
    "resultadoIdOriginal" TEXT,
    "laboratorio" TEXT,
    "medicoSolicitante" TEXT,
    "fechaToma" TIMESTAMP(3),
    "horaToma" TEXT,
    "fechaResultado" TIMESTAMP(3),
    "datosMuestra" JSONB,
    "pacienteNombreOcr" TEXT,
    "pacienteIdOcr" TEXT,
    "pacienteFechaNacimiento" TIMESTAMP(3),
    "pacienteSexo" TEXT,
    "pacienteEdad" INTEGER,
    "estadoOcr" TEXT NOT NULL DEFAULT 'PROCESANDO',
    "errorOcr" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analisis_resultados_pkey" PRIMARY KEY ("id")
);

-- 4. Crear índice único en ordenAnalisisId
CREATE UNIQUE INDEX IF NOT EXISTS "analisis_resultados_ordenAnalisisId_key"
ON "analisis_resultados"("ordenAnalisisId");

-- 5. Crear índice único en archivoId
CREATE UNIQUE INDEX IF NOT EXISTS "analisis_resultados_archivoId_key"
ON "analisis_resultados"("archivoId");

-- 6. Crear tabla analisis_grupos
CREATE TABLE IF NOT EXISTS "analisis_grupos" (
    "id" TEXT NOT NULL,
    "analisisResultadoId" TEXT NOT NULL,
    "nombreGrupo" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analisis_grupos_pkey" PRIMARY KEY ("id")
);

-- 7. Crear FK de analisis_grupos → analisis_resultados
ALTER TABLE "analisis_grupos"
ADD CONSTRAINT "analisis_grupos_analisisResultadoId_fkey"
FOREIGN KEY ("analisisResultadoId")
REFERENCES "analisis_resultados"("id")
ON DELETE CASCADE;

-- 8. Crear tabla analisis_items
CREATE TABLE IF NOT EXISTS "analisis_items" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "unidad" TEXT,
    "rangoMin" TEXT,
    "rangoMax" TEXT,
    "rangoReferencia" TEXT,
    "estado" TEXT,
    "nota" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analisis_items_pkey" PRIMARY KEY ("id")
);

-- 9. Crear FK de analisis_items → analisis_grupos
ALTER TABLE "analisis_items"
ADD CONSTRAINT "analisis_items_grupoId_fkey"
FOREIGN KEY ("grupoId")
REFERENCES "analisis_grupos"("id")
ON DELETE CASCADE;
