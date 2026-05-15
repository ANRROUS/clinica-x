/**
 * ============================================================================
 * Caso de uso — Obtener Consulta por ID
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import { ConsultaNoEncontradaError } from '@/modules/consultas/domain/exceptions/consulta.errors';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IObtenerConsultaPort, ConsultaDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class ObtenerConsultaUseCase implements IObtenerConsultaPort {
  constructor(private readonly repository: IConsultaRepository) {}

  async execute(consultaId: string): Promise<Result<ConsultaDto, Error>> {
    const consulta = await this.repository.buscarPorId(consultaId);
    if (!consulta) {
      return Err(new ConsultaNoEncontradaError());
    }
    return Ok(toConsultaDto(consulta));
  }
}
