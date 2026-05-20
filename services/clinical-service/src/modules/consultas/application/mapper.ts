/**
 * ============================================================================
 * Mapper — Entidad Consulta ↔ DTOs planos
 * ============================================================================
 */

import type { Consulta } from '@/modules/consultas/domain/entities/consulta.entity';
import type { ConsultaDto } from '@/modules/consultas/domain/ports/in/consultas.port';

export function toConsultaDto(
  consulta: Consulta,
  extras?: {
    pacienteNombre?: string;
    pacienteApellido?: string;
    pacienteDni?: string;
    pacienteEmail?: string;
    pacienteTelefono?: string;
    analysisOrders?: { examName: string; specialty?: string }[];
    medications?: { name: string; days: number; frequency: string }[];
  },
): ConsultaDto {
  return {
    id: consulta.id,
    pacienteId: consulta.pacienteId,
    medicoId: consulta.medicoId,
    citaId: consulta.citaId ?? null,
    estado: consulta.estado,
    motivoConsulta: consulta.motivoConsulta ?? null,
    diagnostico: consulta.diagnostico ?? null,
    notas: consulta.notas ?? null,
    fechaInicio: consulta.fechaInicio.toISOString(),
    fechaFin: consulta.fechaFin?.toISOString() ?? null,
    pacienteNombre: extras?.pacienteNombre,
    pacienteApellido: extras?.pacienteApellido,
    pacienteDni: extras?.pacienteDni,
    pacienteEmail: extras?.pacienteEmail,
    pacienteTelefono: extras?.pacienteTelefono,
    analysisOrders: extras?.analysisOrders,
    medications: extras?.medications,
  };
}
