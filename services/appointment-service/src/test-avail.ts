import { PrismaMedicoConsulta } from './modules/citas/infrastructure/adapters/out/persistence/prisma-medico-consulta.adapter';
import { PrismaCitaRepository } from './modules/citas/infrastructure/adapters/out/persistence/prisma-cita.repository';
import { ObtenerDisponibilidadPorEspecialidadUseCase } from './modules/citas/application/features/obtener-disponibilidad-por-especialidad/obtener-disponibilidad-por-especialidad.use-case';

import { IAuthServiceClient } from './modules/medicos/domain/ports/out/medico.repository.port';

async function main() {
  const repo = new PrismaCitaRepository();
  const medicoReader = new PrismaMedicoConsulta();
  
  const mockAuthClient: IAuthServiceClient = {
    crearUsuarioMedico: async () => ({ id: '' }),
    actualizarUsuario: async () => {},
    obtenerUsuariosPorIds: async (ids: string[]) => {
      return ids.map(id => ({
        id,
        nombre: 'Dr. Test',
        apellido: 'Resolucion',
        dni: '12345678',
        email: 'test@example.com',
      }));
    }
  };

  const useCase = new ObtenerDisponibilidadPorEspecialidadUseCase(repo, medicoReader, mockAuthClient);

  const especialidadId = '4c2dceed-452d-41e0-933b-a55c6cc70c8c';
  console.log(`Executing ObtenerDisponibilidadPorEspecialidad for id: ${especialidadId}`);
  const result = await useCase.execute({ especialidadId });
  
  if (result.isOk) {
    console.log('SUCCESS:');
    console.log(JSON.stringify(result.value, null, 2));
  } else {
    console.log('ERROR:', result.error);
  }
}

main().catch(console.error);
