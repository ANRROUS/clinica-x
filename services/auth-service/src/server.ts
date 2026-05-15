/**
 * ============================================================================
 * auth-service — Bootstrap del servidor Express
 * ============================================================================
 *
 * Responsabilidad: gestionar Usuarios del sistema (PACIENTE, MEDICO, ADMIN).
 * Endpoints: /api/auth/*
 *
 * En Fase 0 solo expone /health. Los módulos de negocio se montarán en Fase 1.
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestIdMiddleware, errorHandler } from '@clinica-x/shared-middleware';
import { env } from './env';
import { logger } from './shared/logger';
import { disconnectPrisma } from './shared/prisma-client';

const app = express();

// ─── Middlewares globales ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware());

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      service: 'auth-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

// ─── Rutas de negocio (se montarán en Fase 1) ──────────────────────────────
// app.use('/api/auth', usuariosRouter);

// ─── Manejador global de errores (al final) ─────────────────────────────────
app.use(errorHandler);

// ─── Arranque ───────────────────────────────────────────────────────────────
const server = app.listen(env.PORT, () => {
  logger.info(`🔐 auth-service escuchando en http://localhost:${env.PORT}`);
});

// ─── Apagado limpio ─────────────────────────────────────────────────────────
const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} recibido, cerrando auth-service...`);
  server.close(async () => {
    await disconnectPrisma();
    logger.info('auth-service cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
