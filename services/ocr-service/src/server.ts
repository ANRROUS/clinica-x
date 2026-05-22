import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestIdMiddleware, errorHandler, jwtMiddleware, requestLogger } from '@clinica-x/shared-middleware';
import { env } from './env';
import { logger } from './shared/logger';
import { disconnectPrisma } from './shared/prisma-client';
import { nowLima } from '@clinica-x/date-utils';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware());
app.use(requestLogger(logger, 'ocr-service'));

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      service: 'ocr-service',
      status: 'ok',
      timestamp: nowLima().toISOString(),
    },
  });
});

import { ocrRouter } from '@/modules/ocr/infrastructure/di';

app.use(
  '/api/ocr',
  jwtMiddleware({ secret: env.JWT_SECRET }),
  ocrRouter,
);

app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  logger.info(`ocr-service escuchando en http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} recibido, cerrando ocr-service...`);
  server.close(async () => {
    await disconnectPrisma();
    logger.info('ocr-service cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
