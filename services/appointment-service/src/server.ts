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
import cors from 'cors';
import helmet from 'helmet';
import { requestIdMiddleware, errorHandler, jwtMiddleware, requireRole } from '@clinica-x/shared-middleware';
import { env } from './env';
import { logger } from './shared/logger';
import { disconnectPrisma } from './shared/prisma-client';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware());

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      service: 'appointment-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

import { medicosAdminRouter } from '@/modules/medicos/infrastructure/di';
import { citasRouter } from '@/modules/citas/infrastructure/di';

// Rutas de negocio — Fase 2 (admin médicos)
app.use(
  '/api/admin/doctors',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  requireRole(['ADMIN']),
  medicosAdminRouter,
);

// Rutas de negocio — Fase 3 (booking + calendario)
app.use(
  '/api/appointments',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  citasRouter,
);

app.use(errorHandler);

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
