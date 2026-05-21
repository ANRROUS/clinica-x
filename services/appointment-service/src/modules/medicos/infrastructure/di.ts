/**
 * ============================================================================
 * Composition Root del módulo de médicos
 * ============================================================================
 */

import { PrismaMedicoRepository } from '@/modules/medicos/infrastructure/adapters/out/persistence/prisma-medico.repository';
import { AuthServiceClient } from '@/modules/medicos/infrastructure/adapters/out/external-apis/auth-service.client';
import { CrearMedicoUseCase } from '@/modules/medicos/application/features/crear-medico/crear-medico.use-case';
import { ActualizarMedicoUseCase } from '@/modules/medicos/application/features/actualizar-medico/actualizar-medico.use-case';
import { ListarMedicosUseCase } from '@/modules/medicos/application/features/listar-medicos/listar-medicos.use-case';
import { ObtenerMedicoUseCase } from '@/modules/medicos/application/features/obtener-medico/obtener-medico.use-case';
import { CambiarEstadoMedicoUseCase } from '@/modules/medicos/application/features/cambiar-estado-medico/cambiar-estado-medico.use-case';
import { ObtenerMetricasDashboardUseCase } from '@/modules/medicos/application/features/obtener-metricas-dashboard/obtener-metricas-dashboard.use-case';
import { MedicosController } from '@/modules/medicos/infrastructure/adapters/in/http/medicos.controller';
import { createMedicosRouter } from '@/modules/medicos/infrastructure/adapters/in/http/medicos.router';

// ─── Adaptadores de salida ──────────────────────────────────────────────────
const medicoRepository = new PrismaMedicoRepository();
const authServiceClient = new AuthServiceClient();

// ─── Casos de uso ───────────────────────────────────────────────────────────
const crearMedicoUseCase = new CrearMedicoUseCase(medicoRepository, authServiceClient);
const actualizarMedicoUseCase = new ActualizarMedicoUseCase(medicoRepository, authServiceClient);
const listarMedicosUseCase = new ListarMedicosUseCase(medicoRepository, authServiceClient);
const obtenerMedicoUseCase = new ObtenerMedicoUseCase(medicoRepository, authServiceClient);
const cambiarEstadoMedicoUseCase = new CambiarEstadoMedicoUseCase(medicoRepository);
const obtenerMetricasDashboardUseCase = new ObtenerMetricasDashboardUseCase();

// ─── Controlador ────────────────────────────────────────────────────────────
const medicosController = new MedicosController(
  crearMedicoUseCase,
  actualizarMedicoUseCase,
  listarMedicosUseCase,
  obtenerMedicoUseCase,
  cambiarEstadoMedicoUseCase,
  obtenerMetricasDashboardUseCase,
);

// ─── Router ─────────────────────────────────────────────────────────────────
export const medicosAdminRouter = createMedicosRouter(medicosController);
