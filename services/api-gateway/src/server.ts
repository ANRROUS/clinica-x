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
 * El frontend SIEMPRE habla con el gateway en http://localhost:3000.
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

// ─── API Hub Unificado (Scalar) ─────────────────────────────────────────────
app.get('/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>🏥 Clínica X — API Hub</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --theme-bg: #0b0f19;
        --theme-header: #111827;
        --theme-border: #1f2937;
        --theme-text-muted: #9ca3af;
        --theme-primary: #3b82f6;
        --theme-primary-hover: #2563eb;
      }
      body {
        margin: 0;
        padding: 0;
        background-color: var(--theme-bg);
        font-family: 'Outfit', sans-serif;
        color: #f3f4f6;
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }
      header {
        background-color: var(--theme-header);
        border-bottom: 1px solid var(--theme-border);
        padding: 12px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        z-index: 10;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 1.25rem;
        background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .logo-icon {
        font-size: 1.5rem;
        -webkit-text-fill-color: initial;
      }
      nav {
        display: flex;
        gap: 8px;
      }
      .tab-btn {
        background: transparent;
        border: 1px solid transparent;
        color: var(--theme-text-muted);
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease-in-out;
      }
      .tab-btn:hover {
        color: #ffffff;
        background-color: rgba(255, 255, 255, 0.05);
      }
      .tab-btn.active {
        color: #ffffff;
        background: rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.3);
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
      }
      #scalar-container {
        flex-grow: 1;
        overflow-y: auto;
        position: relative;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="logo">
        <span class="logo-icon">🏥</span> Clínica X <span style="font-size: 0.8rem; font-weight: 400; color: var(--theme-text-muted); margin-left: 6px; border: 1px solid var(--theme-border); padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.02); -webkit-text-fill-color: initial;">API HUB</span>
      </div>
      <nav>
        <a href="?service=auth" id="btn-auth" class="tab-btn">🔐 Autenticación</a>
        <a href="?service=appointments" id="btn-appointments" class="tab-btn">📅 Citas Médicas</a>
        <a href="?service=medical" id="btn-medical" class="tab-btn">🩺 Gestión Clínica</a>
        <a href="?service=files" id="btn-files" class="tab-btn">📁 Archivos</a>
        <a href="?service=ocr" id="btn-ocr" class="tab-btn">👁️ Procesamiento OCR</a>
      </nav>
    </header>
    
    <div id="scalar-container">
      <div id="app"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      const params = new URLSearchParams(window.location.search);
      const currentService = params.get('service') || 'auth';
      
      const activeBtn = document.getElementById('btn-' + currentService);
      if (activeBtn) {
        activeBtn.classList.add('active');
      }

      let specPath = '/api/auth/openapi.json';
      if (currentService === 'appointments') specPath = '/api/appointments/openapi.json';
      else if (currentService === 'medical') specPath = '/api/medical/openapi.json';
      else if (currentService === 'files') specPath = '/api/files/openapi.json';
      else if (currentService === 'ocr') specPath = '/api/ocr/openapi.json';

      Scalar.createApiReference('#app', {
        url: specPath,
        theme: 'default',
        showSidebar: true
      });
    </script>
  </body>
</html>`);
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
