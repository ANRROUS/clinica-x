/**
 * ============================================================================
 * Caso de uso: ListarCitasMedico
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type {
  IListarCitasMedicoPort,
  ListarCitasMedicoDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import type { IAuthServiceClient } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';

export class ListarCitasMedicoUseCase implements IListarCitasMedicoPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
    private readonly authServiceClient: IAuthServiceClient,
  ) {}

  async execute(dto: ListarCitasMedicoDto): Promise<Result<CitaResponseDto[], Error>> {
    const citas = await this.repo.buscarPorMedico(
      dto.medicoId,
      dto.fechaDesde,
      dto.fechaHasta,
    );

    const medico = await this.medicoReader.buscarPorId(dto.medicoId);

    const pacienteIds = [...new Set(citas.map((c) => c.pacienteId))];
    let pacientesMap = new Map<string, { nombre: string; apellido: string }>();
    try {
      const usuarios = await this.authServiceClient.obtenerUsuariosPorIds(pacienteIds);
      pacientesMap = new Map(usuarios.map((u) => [u.id, { nombre: u.nombre, apellido: u.apellido }]));
    } catch {
      // Si falla la llamada a auth-service, continuamos sin nombres de paciente
    }

    const dtos = citas.map((cita) => {
      const paciente = pacientesMap.get(cita.pacienteId);
      return toCitaResponseDto(cita, {
        doctorName: medico?.nombreUsuario,
        specialty: medico?.especialidadNombre,
        pacienteNombre: paciente?.nombre,
        pacienteApellido: paciente?.apellido,
      });
    });

    return Ok(dtos);
  }
}
