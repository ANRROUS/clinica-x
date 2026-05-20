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
 *  - Chat IA "Agente X" (en Fase 0: stub "Próximamente")
 *
 * Endpoints: /api/medical/*
 *
 * En Fase 0 solo expone /health + un endpoint stub del chat IA para que la
 * UI del médico pueda renderizar "Próximamente" sin error.
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestIdMiddleware, errorHandler, jwtMiddleware } from '@clinica-x/shared-middleware';
import { env } from './env';
import { logger } from './shared/logger';
import { disconnectPrisma } from './shared/prisma-client';
import { nowLima } from '@clinica-x/date-utils';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware());

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

// ─── Stub del chat IA — visible desde Fase 0 ───────────────────────────────
// El frontend del médico llamará a este endpoint y mostrará "Próximamente"
// hasta que AI_ENABLED=true y se conecte el adaptador real de OpenAI.
app.post('/api/medical/doctor/ai/chat', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'coming_soon',
      mensaje: 'El Agente X estará disponible próximamente',
    },
  });
});

import { consultasRouter } from '@/modules/consultas/infrastructure/di';

// Rutas de negocio — Fase 4 (consultas)
app.use(
  '/api/medical',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  consultasRouter,
);

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
