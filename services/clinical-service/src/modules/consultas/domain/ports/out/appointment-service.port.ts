/**
 * ============================================================================
 * Port de salida — Appointment Service Client
 * ============================================================================
 * Contrato para comunicación cross-service con appointment-service.
 * ============================================================================
 */

export interface IAppointmentServiceClient {
  completarCita(citaId: string): Promise<boolean>;
}
