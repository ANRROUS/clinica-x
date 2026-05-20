/**
 * ============================================================================
 * Caso de uso — Listar Consultas de Médico
 * ============================================================================
 */

import { Ok } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IAuthServiceClient } from '@/modules/consultas/domain/ports/out/auth-service.port';
import type { IListarConsultasMedicoPort, ConsultaDto, ListarConsultasDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class ListarConsultasMedicoUseCase implements IListarConsultasMedicoPort {
  constructor(
    private readonly repository: IConsultaRepository,
    private readonly authServiceClient: IAuthServiceClient,
  ) {}

  async execute(dto: ListarConsultasDto): Promise<Result<ConsultaDto[], Error>> {
    const consultas = await this.repository.listar({
      medicoId: dto.medicoId,
      estado: dto.estado,
      fechaDesde: dto.fechaDesde,
      fechaHasta: dto.fechaHasta,
    });

    const pacienteIds = [...new Set(consultas.map((c) => c.pacienteId))];
    let pacientesMap = new Map<string, { nombre: string; apellido: string; dni: string; email: string; telefono?: string }>();
    try {
      const usuarios = await this.authServiceClient.obtenerUsuariosPorIds(pacienteIds);
      pacientesMap = new Map(usuarios.map((u) => [u.id, { nombre: u.nombre, apellido: u.apellido, dni: u.dni, email: u.email, telefono: u.telefono }]));
    } catch {
    }

    const dtos = consultas.map((consulta) => {
      const paciente = pacientesMap.get(consulta.pacienteId);
      return toConsultaDto(consulta, {
        pacienteNombre: paciente?.nombre,
        pacienteApellido: paciente?.apellido,
        pacienteDni: paciente?.dni,
        pacienteEmail: paciente?.email,
        pacienteTelefono: paciente?.telefono,
      });
    });

    return Ok(dtos);
  }
}
