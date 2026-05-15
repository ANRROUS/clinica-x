import { Result, Ok } from '@clinica-x/shared-kernel';
import type {
  IListarEspecialidadesPort,
  EspecialidadDTO,
} from '@/modules/especialidades/domain/ports/in/especialidades.port';
import type { IEspecialidadRepository } from '@/modules/especialidades/domain/ports/out/especialidad.repository.port';

export class ListarEspecialidadesUseCase implements IListarEspecialidadesPort {
  constructor(private readonly repo: IEspecialidadRepository) {}

  async execute(): Promise<Result<EspecialidadDTO[], Error>> {
    const especialidades = await this.repo.listar();
    return Ok(especialidades);
  }
}