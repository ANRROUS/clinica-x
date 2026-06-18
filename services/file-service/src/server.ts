/**
 * ============================================================================
 * file-service — Bootstrap del servidor Express
 * ============================================================================
 *
 * Responsabilidad:
 *  - Recibir uploads multipart (PDFs / imágenes)
 *  - Validar MIME type y tamaño
 *  - Subir a S3 y guardar referencia en Postgres
 *  - Generar signed URLs para descarga
 *
 * Endpoints: /api/files/*
 *
 * En Fase 0 solo expone /health.
 * ============================================================================
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestIdMiddleware, errorHandler, jwtMiddleware, requestLogger } from '@clinica-x/shared-middleware';
import { env } from './env';
import { logger } from './shared/logger';
import { disconnectPrisma } from './shared/prisma-client';
import { nowLima } from '@clinica-x/date-utils';
import { swaggerSpec } from './config/openapi.config';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware());
app.use(requestLogger(logger, 'file-service'));

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      service: 'file-service',
      status: 'ok',
      bucket: env.AWS_BUCKET,
      max_size_bytes: env.MAX_FILE_SIZE_BYTES,
      allowed_mime_types: env.ALLOWED_MIME_TYPES,
      timestamp: nowLima().toISOString(),
    },
  });
});

// ─── Documentación API (Scalar) ──────────────────────────────────────────────
app.get('/api/files/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

app.get('/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Clínica X — File Service API</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/api/files/openapi.json"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});

import { archivosRouter, storageAdapter } from '@/modules/archivos/infrastructure/di';

// ─── Inicialización del storage ─────────────────────────────────────────────
const iniciarStorage = async (): Promise<void> => {
  try {
    await storageAdapter.inicializar();
  } catch (err) {
    logger.warn({ err }, 'No se pudo inicializar el bucket de Supabase Storage');
  }
};

// Rutas de negocio — Fase 4 (archivos)
app.use(
  '/api/files',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  archivosRouter,
);

app.use(errorHandler);

const server = app.listen(env.PORT, async () => {
  logger.info(`📁 file-service escuchando en http://localhost:${env.PORT}`);
  logger.info(`   Bucket: ${env.SUPABASE_BUCKET}`);
  await iniciarStorage();
});

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} recibido, cerrando file-service...`);
  server.close(async () => {
    await disconnectPrisma();
    logger.info('file-service cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
