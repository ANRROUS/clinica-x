import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { EspecialidadNoEncontradaError, EspecialidadDuplicadaError } from '@/modules/especialidades/domain/exceptions/especialidad.errors';
import type {
  IActualizarEspecialidadPort,
  ActualizarEspecialidadDto,
  EspecialidadDTO,
} from '@/modules/especialidades/domain/ports/in/especialidades.port';
import type { IEspecialidadRepository } from '@/modules/especialidades/domain/ports/out/especialidad.repository.port';

export class ActualizarEspecialidadUseCase implements IActualizarEspecialidadPort {
  constructor(private readonly repo: IEspecialidadRepository) {}

  async execute(id: string, dto: ActualizarEspecialidadDto): Promise<Result<EspecialidadDTO, Error>> {
    const existente = await this.repo.buscarPorId(id);
    if (!existente) {
      return Err(new EspecialidadNoEncontradaError(id));
    }

    if (dto.nombre !== undefined) {
      const duplicado = await this.repo.buscarPorNombre(dto.nombre.trim());
      if (duplicado && duplicado.id !== id) {
        return Err(new EspecialidadDuplicadaError('nombre', dto.nombre.trim()));
      }
    }

    const actualizada = await this.repo.actualizar(id, dto);
    return Ok(actualizada);
  }
}