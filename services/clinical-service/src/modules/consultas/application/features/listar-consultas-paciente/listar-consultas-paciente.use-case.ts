/**
 * ============================================================================
 * Caso de uso — Listar Consultas de Paciente
 * ============================================================================
 */

import { Ok } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IListarConsultasPacientePort, ConsultaDto, ListarConsultasDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class ListarConsultasPacienteUseCase implements IListarConsultasPacientePort {
  constructor(private readonly repository: IConsultaRepository) {}

  async execute(dto: ListarConsultasDto): Promise<Result<ConsultaDto[], Error>> {
    const consultas = await this.repository.listar({
      pacienteId: dto.pacienteId,
      estado: dto.estado,
      fechaDesde: dto.fechaDesde,
      fechaHasta: dto.fechaHasta,
    });
    return Ok(consultas.map((c) => toConsultaDto(c)));
  }
}
