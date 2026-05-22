/**
 * ============================================================================
 * Caso de uso — Obtener Detalle de Paciente
 * ============================================================================
 * Retorna datos personales del paciente + historial de consultas finalizadas.
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IAuthServiceClient } from '@/modules/consultas/domain/ports/out/auth-service.port';
import type {
  IObtenerPacienteDetallePort,
  PacienteDetalleDto,
  ConsultaDto,
} from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class ObtenerPacienteDetalleUseCase implements IObtenerPacienteDetallePort {
  constructor(
    private readonly repository: IConsultaRepository,
    private readonly authServiceClient: IAuthServiceClient,
  ) {}

  async execute(medicoId: string, pacienteId: string): Promise<Result<PacienteDetalleDto, Error>> {
    const consultas = await this.repository.listar({
      pacienteId,
    });

    const consultasFinalizadas = consultas.filter((c) => c.estado === 'FINALIZADA');

    let pacienteData: { id: string; nombre: string; apellido: string; dni: string; email: string; telefono?: string } | null = null;
    try {
      const usuarios = await this.authServiceClient.obtenerUsuariosPorIds([pacienteId]);
      if (usuarios.length > 0) {
        pacienteData = usuarios[0];
      }
    } catch {
      // Si falla auth-service, continuamos sin datos del paciente
    }

    if (!pacienteData) {
      return Err(new Error('PACIENTE_NO_ENCONTRADO'));
    }

    const medicoIds = Array.from(new Set(consultasFinalizadas.map((c) => c.medicoId)));
    let medicosMap = new Map<string, { nombre: string; apellido: string }>();
    try {
      if (medicoIds.length > 0) {
        const medicos = await this.authServiceClient.obtenerUsuariosPorIds(medicoIds);
        medicos.forEach((m) => medicosMap.set(m.id, m));
      }
    } catch {
      // Continuar si falla
    }

    const consultaDtos: ConsultaDto[] = consultasFinalizadas.map((consulta) => {
      const medico = medicosMap.get(consulta.medicoId);
      return toConsultaDto(consulta, {
        pacienteNombre: pacienteData!.nombre,
        pacienteApellido: pacienteData!.apellido,
        pacienteDni: pacienteData!.dni,
        pacienteEmail: pacienteData!.email,
        pacienteTelefono: pacienteData!.telefono,
        medicoNombre: medico?.nombre,
        medicoApellido: medico?.apellido,
      });
    });

    return Ok({
      patient: {
        id: pacienteData.id,
        nombre: pacienteData.nombre,
        apellido: pacienteData.apellido,
        dni: pacienteData.dni,
        email: pacienteData.email,
        telefono: pacienteData.telefono,
      },
      consultations: consultaDtos,
    });
  }
}
