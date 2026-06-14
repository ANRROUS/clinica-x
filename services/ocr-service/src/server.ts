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

// ─── Documentación API (Scalar) ──────────────────────────────────────────────
app.get('/api/ocr/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

app.get('/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Clínica X — OCR Service API</title>
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
      data-url="/api/ocr/openapi.json"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});

import { ocrRouter } from '@/modules/ocr/infrastructure/di';

app.use(
  '/api/ocr',
  jwtMiddleware({ secret: env.JWT_SECRET, skipPaths: ['/api/ocr/process'] }),
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
