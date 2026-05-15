/**
 * ============================================================================
 * Caso de uso — Listar Consultas de Médico
 * ============================================================================
 */

import { Ok } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IListarConsultasMedicoPort, ConsultaDto, ListarConsultasDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class ListarConsultasMedicoUseCase implements IListarConsultasMedicoPort {
  constructor(private readonly repository: IConsultaRepository) {}

  async execute(dto: ListarConsultasDto): Promise<Result<ConsultaDto[], Error>> {
    const consultas = await this.repository.listar({
      medicoId: dto.medicoId,
      estado: dto.estado,
      fechaDesde: dto.fechaDesde,
      fechaHasta: dto.fechaHasta,
    });
    return Ok(consultas.map(toConsultaDto));
  }
}
