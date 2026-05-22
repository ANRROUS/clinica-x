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
import { disconnectPrisma, prisma } from './shared/prisma-client';
import { nowLima } from '@clinica-x/date-utils';
import bcrypt from 'bcryptjs';

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
      timestamp: nowLima().toISOString(),
    },
  });
});

// ─── Rutas de negocio ───────────────────────────────────────────────────────
import { usuariosRouter } from './modules/usuarios/infrastructure/di';
app.use('/api/auth', usuariosRouter);

// ─── Manejador global de errores (al final) ─────────────────────────────────
app.use(errorHandler);

// ─── Seed automático de usuario test OCR ────────────────────────────────────
async function ensureTestUser(): Promise<void> {
  try {
    const testDni = '99999999';
    const existente = await prisma.usuario.findUnique({ where: { dni: testDni } });
    if (existente) {
      logger.info('Usuario test OCR ya existe (DNI 99999999)');
      return;
    }

    const passwordHash = await bcrypt.hash('Andres123Clinica', 10);
    await prisma.usuario.create({
      data: {
        id: 'test-ocr-001',
        dni: testDni,
        email: 'andres.salesland@gmail.com',
        passwordHash,
        nombre: 'Test',
        apellido: 'OCR',
        telefono: null,
        rol: 'PACIENTE',
      },
    });
    logger.info('✅ Usuario test OCR creado automáticamente (DNI 99999999)');
  } catch (err) {
    logger.error({ err }, 'Error creando usuario test OCR');
  }
}

// ─── Arranque ───────────────────────────────────────────────────────────────
(async function bootstrap() {
  await ensureTestUser();

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
})();
