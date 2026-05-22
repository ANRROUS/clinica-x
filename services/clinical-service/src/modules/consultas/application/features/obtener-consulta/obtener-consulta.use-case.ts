/**
 * ============================================================================
 * Caso de uso — Obtener Consulta por ID
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import { ConsultaNoEncontradaError } from '@/modules/consultas/domain/exceptions/consulta.errors';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IAuthServiceClient } from '@/modules/consultas/domain/ports/out/auth-service.port';
import type { IObtenerConsultaPort, ConsultaDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class ObtenerConsultaUseCase implements IObtenerConsultaPort {
  constructor(
    private readonly repository: IConsultaRepository,
    private readonly authServiceClient: IAuthServiceClient,
  ) {}

  async execute(consultaId: string): Promise<Result<ConsultaDto, Error>> {
    const consulta = await this.repository.buscarPorId(consultaId);
    if (!consulta) {
      return Err(new ConsultaNoEncontradaError());
    }

    let pacienteData: any = undefined;
    let medicoData: any = undefined;

    try {
      const usuarios = await this.authServiceClient.obtenerUsuariosPorIds([consulta.pacienteId, consulta.medicoId]);
      pacienteData = usuarios.find((u) => u.id === consulta.pacienteId);
      medicoData = usuarios.find((u) => u.id === consulta.medicoId);
    } catch (err) {
      // Continuamos sin metadatos si falla
    }

    return Ok(
      toConsultaDto(consulta, {
        pacienteNombre: pacienteData?.nombre,
        pacienteApellido: pacienteData?.apellido,
        pacienteDni: pacienteData?.dni,
        pacienteEmail: pacienteData?.email,
        pacienteTelefono: pacienteData?.telefono,
        medicoNombre: medicoData?.nombre,
        medicoApellido: medicoData?.apellido,
      }),
    );
  }
}
