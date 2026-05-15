/**
 * ============================================================================
 * Mapper — Entidad Consulta ↔ DTOs planos
 * ============================================================================
 */

import type { Consulta } from '@/modules/consultas/domain/entities/consulta.entity';
import type { ConsultaDto } from '@/modules/consultas/domain/ports/in/consultas.port';

export function toConsultaDto(consulta: Consulta): ConsultaDto {
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
  };
}
