/**
 * ============================================================================
 * Composition Root del módulo de citas
 * ============================================================================
 */

import { PrismaCitaRepository } from '@/modules/citas/infrastructure/adapters/out/persistence/prisma-cita.repository';
import { PrismaMedicoConsulta } from '@/modules/citas/infrastructure/adapters/out/persistence/prisma-medico-consulta.adapter';
import { CrearCitaUseCase } from '@/modules/citas/application/features/crear-cita/crear-cita.use-case';
import { CrearCitaAutomaticaUseCase } from '@/modules/citas/application/features/crear-cita-automatica/crear-cita-automatica.use-case';
import { CancelarCitaUseCase } from '@/modules/citas/application/features/cancelar-cita/cancelar-cita.use-case';
import { ReprogramarCitaUseCase } from '@/modules/citas/application/features/reprogramar-cita/reprogramar-cita.use-case';
import { ListarCitasPacienteUseCase } from '@/modules/citas/application/features/listar-citas-paciente/listar-citas-paciente.use-case';
import { ListarCitasMedicoUseCase } from '@/modules/citas/application/features/listar-citas-medico/listar-citas-medico.use-case';
import { ObtenerDisponibilidadUseCase } from '@/modules/citas/application/features/obtener-disponibilidad/obtener-disponibilidad.use-case';
import { ObtenerDisponibilidadPorEspecialidadUseCase } from '@/modules/citas/application/features/obtener-disponibilidad-por-especialidad/obtener-disponibilidad-por-especialidad.use-case';
import { CambiarEstadoCitaUseCase } from '@/modules/citas/application/features/cambiar-estado-cita/cambiar-estado-cita.use-case';
import { CitasController } from '@/modules/citas/infrastructure/adapters/in/http/citas.controller';
import { createCitasRouter } from '@/modules/citas/infrastructure/adapters/in/http/citas.router';

// ─── Adaptadores de salida ──────────────────────────────────────────────────
const citaRepository = new PrismaCitaRepository();
const medicoConsulta = new PrismaMedicoConsulta();

// ─── Casos de uso ───────────────────────────────────────────────────────────
const crearCitaUseCase = new CrearCitaUseCase(citaRepository, medicoConsulta);
const crearCitaAutomaticaUseCase = new CrearCitaAutomaticaUseCase(citaRepository, medicoConsulta);
const cancelarCitaUseCase = new CancelarCitaUseCase(citaRepository);
const reprogramarCitaUseCase = new ReprogramarCitaUseCase(citaRepository, medicoConsulta);
const listarCitasPacienteUseCase = new ListarCitasPacienteUseCase(citaRepository, medicoConsulta);
const listarCitasMedicoUseCase = new ListarCitasMedicoUseCase(citaRepository, medicoConsulta);
const obtenerDisponibilidadUseCase = new ObtenerDisponibilidadUseCase(citaRepository, medicoConsulta);
const obtenerDisponibilidadPorEspecialidadUseCase = new ObtenerDisponibilidadPorEspecialidadUseCase(citaRepository, medicoConsulta);
const cambiarEstadoCitaUseCase = new CambiarEstadoCitaUseCase(citaRepository, medicoConsulta);

// ─── Controlador ────────────────────────────────────────────────────────────
const citasController = new CitasController(
  crearCitaUseCase,
  crearCitaAutomaticaUseCase,
  cancelarCitaUseCase,
  reprogramarCitaUseCase,
  listarCitasPacienteUseCase,
  listarCitasMedicoUseCase,
  obtenerDisponibilidadUseCase,
  obtenerDisponibilidadPorEspecialidadUseCase,
  cambiarEstadoCitaUseCase,
  medicoConsulta,
);

// ─── Router ─────────────────────────────────────────────────────────────────
export const citasRouter = createCitasRouter(citasController);
