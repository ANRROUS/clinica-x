import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { EspecialidadNoEncontradaError } from '@/modules/especialidades/domain/exceptions/especialidad.errors';
import type {
  ICambiarEstadoEspecialidadPort,
  CambiarEstadoEspecialidadDto,
  EspecialidadDTO,
} from '@/modules/especialidades/domain/ports/in/especialidades.port';
import type { IEspecialidadRepository } from '@/modules/especialidades/domain/ports/out/especialidad.repository.port';

export class CambiarEstadoEspecialidadUseCase implements ICambiarEstadoEspecialidadPort {
  constructor(private readonly repo: IEspecialidadRepository) {}

  async execute(id: string, dto: CambiarEstadoEspecialidadDto): Promise<Result<EspecialidadDTO, Error>> {
    const existente = await this.repo.buscarPorId(id);
    if (!existente) {
      return Err(new EspecialidadNoEncontradaError(id));
    }

    const actualizada = await this.repo.cambiarEstado(id, dto.activo);
    return Ok(actualizada);
  }
}