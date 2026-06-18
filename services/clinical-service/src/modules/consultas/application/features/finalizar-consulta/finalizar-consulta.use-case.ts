/**
 * ============================================================================
 * Caso de uso — Finalizar Consulta
 * ============================================================================
 */

import { Ok, Err } from '@clinica-x/shared-kernel';
import type { Result } from '@clinica-x/shared-kernel';
import { ConsultaNoEncontradaError, ConsultaYaFinalizadaError } from '@/modules/consultas/domain/exceptions/consulta.errors';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { IAppointmentServiceClient } from '@/modules/consultas/domain/ports/out/appointment-service.port';
import type { IFinalizarConsultaPort, ConsultaDto, FinalizarConsultaDto } from '@/modules/consultas/domain/ports/in/consultas.port';
import type { OrdenAnalisisValue, MedicamentoValue } from '@/modules/consultas/domain/entities/consulta.entity';
import { toConsultaDto } from '../../mapper';

export class FinalizarConsultaUseCase implements IFinalizarConsultaPort {
  constructor(
    private readonly repository: IConsultaRepository,
    private readonly appointmentServiceClient: IAppointmentServiceClient,
  ) {}

  async execute(consultaId: string, dto: FinalizarConsultaDto): Promise<Result<ConsultaDto, Error>> {
    const consulta = await this.repository.buscarPorId(consultaId);
    if (!consulta) {
      return Err(new ConsultaNoEncontradaError());
    }

    if (consulta.estado === 'FINALIZADA') {
      return Err(new ConsultaYaFinalizadaError());
    }

    const ordenesAnalisis: OrdenAnalisisValue[] = (dto.analysisOrders ?? []).map((o) => ({
      tipoAnalisis: o.examName,
      especialidad: o.specialty,
    }));

    const medicamentos: MedicamentoValue[] = (dto.medications ?? []).map((m) => ({
      nombre: m.name,
      dias: m.days,
      frecuencia: m.frequency,
    }));

    consulta.finalizar(dto.diagnostico, dto.notas, ordenesAnalisis, medicamentos);
    const actualizada = await this.repository.guardar(consulta);

    // Completar la cita en appointment-service si tiene citaId
    if (consulta.citaId) {
      await this.appointmentServiceClient.completarCita(consulta.citaId);
    }

    return Ok(toConsultaDto(actualizada));
  }
}
