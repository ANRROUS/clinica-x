/**
 * ============================================================================
 * Puertos de salida del dominio de citas
 * ============================================================================
 * Contratos que el dominio espera que la infraestructura implemente.
 * ============================================================================
 */

import type { Cita } from '../../entities/cita.entity';

export interface ICitaRepository {
  /** Guarda una cita nueva. */
  guardar(cita: Cita): Promise<void>;

  /** Busca una cita por id. */
  buscarPorId(id: string): Promise<Cita | null>;

  /** Busca todas las citas de un paciente, ordenadas por fecha descendente. */
  buscarPorPaciente(pacienteId: string): Promise<Cita[]>;

  /** Busca citas de un paciente con un médico específico en un día (útil para evitar duplicados). */
  buscarPorPacienteMedicoYDia(pacienteId: string, medicoId: string, fechaInicio: Date, fechaFin: Date): Promise<Cita[]>;

  /** Busca citas de un médico en un rango de fechas. */
  buscarPorMedico(medicoId: string, fechaDesde?: Date, fechaHasta?: Date): Promise<Cita[]>;

  /** Busca citas de un médico en un día específico (útil para disponibilidad). */
  buscarPorMedicoYFecha(medicoId: string, fechaInicio: Date, fechaFin: Date): Promise<Cita[]>;

  /** Cuenta citas de un médico en un rango de tiempo. */
  contarCitasEnRango(medicoId: string, inicio: Date, fin: Date): Promise<number>;

  /**
   * Verifica que no existan citas ocupadas en el rango y, si está libre,
   * guarda la cita dentro de una transacción atómica.
   * Retorna true si se guardó, false si el slot ya estaba ocupado.
   */
  guardarSiLibre(cita: Cita, inicioRango: Date, finRango: Date): Promise<boolean>;

  /** Actualiza una cita existente. */
  actualizar(cita: Cita): Promise<void>;

  /**
   * Verifica que no existan citas ocupadas en el rango (excluyendo la cita actual)
   * y, si está libre, actualiza la cita dentro de una transacción atómica.
   * Retorna true si se actualizó, false si el slot ya estaba ocupado.
   */
  actualizarSiLibre(cita: Cita, inicioRango: Date, finRango: Date): Promise<boolean>;

  /** Elimina una cita por id. */
  eliminar(id: string): Promise<void>;
}
