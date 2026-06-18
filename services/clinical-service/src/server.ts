/**
 * ============================================================================
 * clinical-service — Bootstrap del servidor Express
 * ============================================================================
 *
 * Responsabilidad:
 *  - Consultas médicas (iniciar / finalizar)
 *  - Diagnósticos, recetas, medicamentos
 *  - Órdenes de análisis (asociadas a consulta)
 *  - Historial clínico del paciente
 *
 * Endpoints: /api/medical/*
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
app.use(requestLogger(logger, 'clinical-service'));

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      service: 'clinical-service',
      status: 'ok',
      ai_enabled: env.AI_ENABLED,
      timestamp: nowLima().toISOString(),
    },
  });
});

import { consultasRouter } from '@/modules/consultas/infrastructure/di';
import { prisma } from '@/shared/prisma-client';

// ─── Documentación API (Scalar) ──────────────────────────────────────────────
app.get('/api/medical/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

app.get('/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Clínica X — Clinical Service API</title>
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
      data-url="/api/medical/openapi.json"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});

// Rutas de negocio — Fase 4 (consultas)
app.use(
  '/api/medical',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  consultasRouter,
);

// ─── Catálogos ───────────────────────────────────────────────────────────────
app.get('/api/medical/catalogos/medicamentos', jwtMiddleware({ secret: env.JWT_SECRET }), async (_req, res, next) => {
  try {
    const medicamentos = await prisma.catalogoMedicamento.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
    res.json({ success: true, data: medicamentos });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  logger.info(`🩺 clinical-service escuchando en http://localhost:${env.PORT}`);
  if (!env.AI_ENABLED) {
    logger.info('   IA deshabilitada (AI_ENABLED=false) — chat devolverá "coming_soon"');
  }
});

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} recibido, cerrando clinical-service...`);
  server.close(async () => {
    await disconnectPrisma();
    logger.info('clinical-service cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
