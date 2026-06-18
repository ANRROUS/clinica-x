/**
 * ============================================================================
 * appointment-service — Bootstrap del servidor Express
 * ============================================================================
 *
 * Responsabilidad:
 *  - Gestión de médicos y horarios (CRUD admin)
 *  - Dashboard de admin (métricas)
 *  - Disponibilidad y reserva de citas (paciente)
 *  - Calendario del médico (vistas mensual/semanal/diaria)
 *
 * Endpoints:
 *   /api/admin/*         (CRUD doctores, métricas)
 *   /api/appointments/*  (booking, calendar)
 *
 * En Fase 0 solo expone /health.
 * ============================================================================
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestIdMiddleware, errorHandler, jwtMiddleware, requireRole, requestLogger } from '@clinica-x/shared-middleware';
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
app.use(requestLogger(logger, 'appointment-service'));

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      service: 'appointment-service',
      status: 'ok',
      timestamp: nowLima().toISOString(),
    },
  });
});

// ─── Documentación API (Scalar) ──────────────────────────────────────────────
app.get('/api/appointments/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

app.get('/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Clínica X — Appointment Service API</title>
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
      data-url="/api/appointments/openapi.json"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});

import { medicosAdminRouter } from '@/modules/medicos/infrastructure/di';
import { citasRouter } from '@/modules/citas/infrastructure/di';
import { especialidadesAdminRouter } from '@/modules/especialidades/infrastructure/di';
import { registerClearHorariosJob } from '@/modules/cron-jobs/clear-horarios.job';

// Rutas de negocio — Fase 2 (admin médicos)
app.use(
  '/api/admin/doctors',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  requireRole(['ADMIN']),
  medicosAdminRouter,
);

// Rutas de negocio — Admin especialidades
app.use(
  '/api/admin/specialties',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  requireRole(['ADMIN']),
  especialidadesAdminRouter,
);

// Rutas de negocio — Fase 3 (booking + calendario)
app.use(
  '/api/appointments',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  citasRouter,
);

app.use(errorHandler);

// ─── Cron jobs ───────────────────────────────────────────────────────────────
registerClearHorariosJob();

const server = app.listen(env.PORT, () => {
  logger.info(`📅 appointment-service escuchando en http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} recibido, cerrando appointment-service...`);
  server.close(async () => {
    await disconnectPrisma();
    logger.info('appointment-service cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
