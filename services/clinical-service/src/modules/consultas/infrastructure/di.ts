/**
 * ============================================================================
 * Composition Root del módulo de consultas
 * ============================================================================
 */

import { PrismaConsultaRepository } from '@/modules/consultas/infrastructure/adapters/out/persistence/prisma-consulta.repository';
import { IniciarConsultaUseCase } from '@/modules/consultas/application/features/iniciar-consulta/iniciar-consulta.use-case';
import { FinalizarConsultaUseCase } from '@/modules/consultas/application/features/finalizar-consulta/finalizar-consulta.use-case';
import { ObtenerConsultaUseCase } from '@/modules/consultas/application/features/obtener-consulta/obtener-consulta.use-case';
import { ListarConsultasPacienteUseCase } from '@/modules/consultas/application/features/listar-consultas-paciente/listar-consultas-paciente.use-case';
import { ListarConsultasMedicoUseCase } from '@/modules/consultas/application/features/listar-consultas-medico/listar-consultas-medico.use-case';
import { ConsultasController } from '@/modules/consultas/infrastructure/adapters/in/http/consultas.controller';
import { createConsultasRouter } from '@/modules/consultas/infrastructure/adapters/in/http/consultas.router';

// ─── Adaptadores de salida ──────────────────────────────────────────────────
const consultaRepository = new PrismaConsultaRepository();

// ─── Casos de uso ───────────────────────────────────────────────────────────
const iniciarConsultaUseCase = new IniciarConsultaUseCase(consultaRepository);
const finalizarConsultaUseCase = new FinalizarConsultaUseCase(consultaRepository);
const obtenerConsultaUseCase = new ObtenerConsultaUseCase(consultaRepository);
const listarConsultasPacienteUseCase = new ListarConsultasPacienteUseCase(consultaRepository);
const listarConsultasMedicoUseCase = new ListarConsultasMedicoUseCase(consultaRepository);

// ─── Controlador ────────────────────────────────────────────────────────────
const consultasController = new ConsultasController(
  iniciarConsultaUseCase,
  finalizarConsultaUseCase,
  obtenerConsultaUseCase,
  listarConsultasPacienteUseCase,
  listarConsultasMedicoUseCase,
);

// ─── Router ─────────────────────────────────────────────────────────────────
export const consultasRouter = createConsultasRouter(consultasController);
