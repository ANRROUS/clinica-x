import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { EspecialidadDuplicadaError } from '@/modules/especialidades/domain/exceptions/especialidad.errors';
import type {
  ICrearEspecialidadPort,
  CrearEspecialidadDto,
  EspecialidadDTO,
} from '@/modules/especialidades/domain/ports/in/especialidades.port';
import type { IEspecialidadRepository } from '@/modules/especialidades/domain/ports/out/especialidad.repository.port';

export class CrearEspecialidadUseCase implements ICrearEspecialidadPort {
  constructor(private readonly repo: IEspecialidadRepository) {}

  async execute(dto: CrearEspecialidadDto): Promise<Result<EspecialidadDTO, Error>> {
    const existente = await this.repo.buscarPorNombre(dto.nombre.trim());
    if (existente) {
      return Err(new EspecialidadDuplicadaError('nombre', dto.nombre.trim()));
    }

    const especialidad = await this.repo.crear(dto.nombre.trim());
    return Ok(especialidad);
  }
}