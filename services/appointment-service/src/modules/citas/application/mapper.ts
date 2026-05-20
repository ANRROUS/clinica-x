/**
 * ============================================================================
 * Mapper entre la entidad de dominio Cita y los DTOs públicos
 * ============================================================================
 */

import type { Cita } from '../domain/entities/cita.entity';
import type { CitaResponseDto } from '../domain/ports/in/citas.port';

export function toCitaResponseDto(
  cita: Cita,
  extras?: {
    doctorName?: string;
    specialty?: string;
    voucherCode?: string;
    pacienteNombre?: string;
    pacienteApellido?: string;
  },
): CitaResponseDto {
  return {
    id: cita.id,
    pacienteId: cita.pacienteId,
    medicoId: cita.medicoId,
    doctorName: extras?.doctorName,
    specialty: extras?.specialty,
    fechaHora: cita.fechaHora.toISOString(),
    estado: cita.estado,
    tipoReserva: cita.tipoReserva,
    motivo: cita.motivo,
    voucherCode: extras?.voucherCode,
    pacienteNombre: extras?.pacienteNombre,
    pacienteApellido: extras?.pacienteApellido,
  };
}
