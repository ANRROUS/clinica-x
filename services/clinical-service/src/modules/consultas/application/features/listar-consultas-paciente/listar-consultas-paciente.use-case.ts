/**
 * ============================================================================
 * Caso de uso — Listar Consultas de Paciente
 * ============================================================================
 */

import { Ok } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IAuthServiceClient } from '@/modules/consultas/domain/ports/out/auth-service.port';
import type { IListarConsultasPacientePort, ConsultaDto, ListarConsultasDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class ListarConsultasPacienteUseCase implements IListarConsultasPacientePort {
  constructor(
    private readonly repository: IConsultaRepository,
    private readonly authServiceClient: IAuthServiceClient,
  ) {}

  async execute(dto: ListarConsultasDto): Promise<Result<ConsultaDto[], Error>> {
    const consultas = await this.repository.listar({
      pacienteId: dto.pacienteId,
      estado: dto.estado,
      fechaDesde: dto.fechaDesde,
      fechaHasta: dto.fechaHasta,
    });

    const medicoIds = Array.from(new Set(consultas.map((c) => c.medicoId)));
    let medicosMap = new Map<string, { nombre: string; apellido: string }>();

    try {
      if (medicoIds.length > 0) {
        const medicos = await this.authServiceClient.obtenerUsuariosPorIds(medicoIds);
        medicos.forEach((m) => medicosMap.set(m.id, m));
      }
    } catch (err) {
      // Continuamos sin nombres de médicos si falla
    }

    const dtos = consultas.map((c) => {
      const medico = medicosMap.get(c.medicoId);
      return toConsultaDto(c, {
        medicoNombre: medico?.nombre,
        medicoApellido: medico?.apellido,
      });
    });

    return Ok(dtos);
  }
}
