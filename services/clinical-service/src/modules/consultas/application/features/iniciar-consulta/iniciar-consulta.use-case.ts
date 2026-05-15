/**
 * ============================================================================
 * Caso de uso — Iniciar Consulta
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import { Consulta } from '@/modules/consultas/domain/entities/consulta.entity';
import { ConsultaActivaExistenteError } from '@/modules/consultas/domain/exceptions/consulta.errors';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IIniciarConsultaPort, ConsultaDto, IniciarConsultaDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import { toConsultaDto } from '../../mapper';

export class IniciarConsultaUseCase implements IIniciarConsultaPort {
  constructor(private readonly repository: IConsultaRepository) {}

  async execute(dto: IniciarConsultaDto): Promise<Result<ConsultaDto, Error>> {
    // Validar que no exista consulta activa para este paciente y médico
    const activa = await this.repository.buscarActivaPorPacienteYMedico(dto.pacienteId, dto.medicoId);
    if (activa) {
      return Err(new ConsultaActivaExistenteError());
    }

    const resultado = Consulta.create(crypto.randomUUID(), {
      pacienteId: dto.pacienteId,
      medicoId: dto.medicoId,
      citaId: dto.citaId,
      motivoConsulta: dto.motivoConsulta,
      estado: 'ACTIVA',
    });

    if (resultado.isErr) {
      return Err(resultado.error);
    }

    const guardada = await this.repository.guardar(resultado.value);
    return Ok(toConsultaDto(guardada));
  }
}
