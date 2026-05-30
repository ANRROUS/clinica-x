/**
 * ============================================================================
 * api-gateway — Punto único de entrada del backend
 * ============================================================================
 *
 * Responsabilidades:
 *  - Reverse proxy hacia los 4 microservicios
 *  - Validación JWT temprana (excepto rutas públicas)
 *  - CORS para el frontend
 *  - Rate limiting global
 *  - Header X-Request-Id para correlación de logs
 *
 * El frontend SIEMPRE habla con el gateway en http://localhost:8080.
 * Los microservicios no se exponen directamente (binding a 127.0.0.1).
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { jwtMiddleware, requestIdMiddleware, requestLogger } from '@clinica-x/shared-middleware';
import { env } from './env';
import { logger } from './logger';
import { rutasProxy, rutasPublicas } from './proxy/routes';
import { nowLima } from '@clinica-x/date-utils';

const app = express();

// ─── Seguridad y CORS ───────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // el gateway no sirve HTML
  }),
);

const origins = env.CORS_ORIGIN.split(',').map((s) => s.trim());
app.use(
  cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
  }),
);

app.use(requestIdMiddleware());
app.use(requestLogger(logger, 'api-gateway'));

// ─── Rate limit global ──────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 60_000, // 1 min
    max: 300, // 300 req/min/IP
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ─── Health del propio gateway ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      service: 'api-gateway',
      status: 'ok',
      upstreams: rutasProxy.map((r) => ({ prefijo: r.prefijo, upstream: r.upstream })),
      timestamp: nowLima().toISOString(),
    },
  });
});

// ─── Validación JWT (con skip de rutas públicas) ────────────────────────────
app.use(
  jwtMiddleware({
    secret: env.JWT_SECRET,
    skipPaths: rutasPublicas,
  }),
);

// ─── Proxies por prefijo ────────────────────────────────────────────────────
for (const ruta of rutasProxy) {
  app.use(
    createProxyMiddleware({
      target: ruta.upstream,
      changeOrigin: true,
      pathFilter: ruta.prefijo,
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.headers['x-request-id']) {
            proxyReq.setHeader('x-request-id', String(req.headers['x-request-id']));
          }
        },
        error: (err, _req, res) => {
          logger.error({ err, servicio: ruta.servicio }, 'Error de proxy');
          const httpRes = res as Partial<express.Response>;
          if (
            typeof httpRes.status === 'function' &&
            typeof httpRes.json === 'function' &&
            !httpRes.headersSent
          ) {
            httpRes.status(502).json({
              success: false,
              error: {
                codigo: 'UPSTREAM_NO_DISPONIBLE',
                mensaje: `El servicio ${ruta.servicio} no está disponible`,
              },
            });
          }
        },
      },
    }),
  );
  logger.info(`  ↪️  ${ruta.prefijo}  →  ${ruta.upstream}  (${ruta.servicio})`);
}

// ─── 404 catch-all ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      codigo: 'RUTA_NO_ENCONTRADA',
      mensaje: 'La ruta solicitada no existe en el gateway',
    },
  });
});

// ─── Arranque ───────────────────────────────────────────────────────────────
const server = app.listen(env.PORT, () => {
  logger.info(`🚪 api-gateway escuchando en http://localhost:${env.PORT}`);
});

const shutdown = (signal: string): void => {
  logger.info(`${signal} recibido, cerrando api-gateway...`);
  server.close(() => {
    logger.info('api-gateway cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
