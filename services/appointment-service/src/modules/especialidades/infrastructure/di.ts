import { PrismaEspecialidadRepository } from '@/modules/especialidades/infrastructure/adapters/out/persistence/prisma-especialidad.repository';
import { ListarEspecialidadesUseCase } from '@/modules/especialidades/application/features/listar-especialidades/listar-especialidades.use-case';
import { CrearEspecialidadUseCase } from '@/modules/especialidades/application/features/crear-especialidad/crear-especialidad.use-case';
import { ActualizarEspecialidadUseCase } from '@/modules/especialidades/application/features/actualizar-especialidad/actualizar-especialidad.use-case';
import { CambiarEstadoEspecialidadUseCase } from '@/modules/especialidades/application/features/cambiar-estado-especialidad/cambiar-estado-especialidad.use-case';
import { EspecialidadesController } from '@/modules/especialidades/infrastructure/adapters/in/http/especialidades.controller';
import { createEspecialidadesRouter } from '@/modules/especialidades/infrastructure/adapters/in/http/especialidades.router';

const especialidadRepository = new PrismaEspecialidadRepository();

const listarEspecialidadesUseCase = new ListarEspecialidadesUseCase(especialidadRepository);
const crearEspecialidadUseCase = new CrearEspecialidadUseCase(especialidadRepository);
const actualizarEspecialidadUseCase = new ActualizarEspecialidadUseCase(especialidadRepository);
const cambiarEstadoEspecialidadUseCase = new CambiarEstadoEspecialidadUseCase(especialidadRepository);

const especialidadesController = new EspecialidadesController(
  listarEspecialidadesUseCase,
  crearEspecialidadUseCase,
  actualizarEspecialidadUseCase,
  cambiarEstadoEspecialidadUseCase,
);

export const especialidadesAdminRouter = createEspecialidadesRouter(especialidadesController);