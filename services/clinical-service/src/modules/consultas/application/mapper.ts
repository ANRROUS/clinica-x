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
    medicoNombre?: string;
    medicoApellido?: string;
  },
): ConsultaDto {
  const analysisOrders = consulta.ordenesAnalisis.map((o) => ({
    id: o.id ?? '',
    examName: o.tipoAnalisis,
    specialty: o.especialidad,
    estado: o.estado ?? 'PENDIENTE',
    archivoId: o.archivoId,
    analisisResultadoId: o.analisisResultadoId,
  }));

  const medications = consulta.medicamentos.map((m) => {
    const baseDate = consulta.fechaFin ?? consulta.fechaInicio;
    const fechaInicioMed = new Date(baseDate);
    const fechaFinMed = new Date(fechaInicioMed.getTime() + m.dias * 24 * 60 * 60 * 1000);
    return {
      name: m.nombre,
      days: m.dias,
      frequency: m.frecuencia,
      fechaInicio: fechaInicioMed.toISOString(),
      fechaFin: fechaFinMed.toISOString(),
    };
  });

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
    medicoNombre: extras?.medicoNombre,
    medicoApellido: extras?.medicoApellido,
    analysisOrders,
    medications,
  };
}
