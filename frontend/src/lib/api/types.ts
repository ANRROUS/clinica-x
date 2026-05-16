export interface UsuarioDTO {
  id: string;
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: 'PACIENTE' | 'MEDICO' | 'ADMIN';
}

export interface EspecialidadDTO {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface SlotDTO {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export interface DiaDisponibilidadDTO {
  fecha: string;
  slots: SlotDTO[];
}

export interface DisponibilidadDoctorDTO {
  doctorId: string;
  doctorName: string;
  specialty: string;
  dias: DiaDisponibilidadDTO[];
}

export interface CitaDTO {
  id: string;
  pacienteId: string;
  medicoId: string;
  doctorName?: string;
  specialty?: string;
  fechaHora: string;
  estado: 'CONFIRMADA' | 'EN_ATENCION' | 'COMPLETADA' | 'CANCELADA';
  tipoReserva: 'MANUAL' | 'AUTOMATICA';
  motivo?: string;
  voucherCode?: string;
}

export interface ConsultaDTO {
  id: string;
  pacienteId: string;
  medicoId: string;
  citaId?: string | null;
  estado: 'ACTIVA' | 'FINALIZADA';
  motivoConsulta?: string | null;
  diagnostico?: string | null;
  notas?: string | null;
  fechaInicio: string;
  fechaFin?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    codigo: string;
    mensaje: string;
    detalles?: { campo: string; mensaje: string }[];
  };
}

export interface CitaCalendarioDTO extends CitaDTO {
  pacienteNombre?: string;
  pacienteApellido?: string;
  especialidad?: string;
}

export interface ConsultaMedicoDTO extends ConsultaDTO {
  pacienteNombre?: string;
  pacienteApellido?: string;
  pacienteDni?: string;
  pacienteEmail?: string;
  pacienteTelefono?: string;
}

export interface PatientSummaryDTO {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
}

export interface PacienteHistorialDTO {
  pacienteId: string;
  pacienteNombre: string;
  pacienteApellido: string;
  totalConsultas: number;
  ultimaConsulta?: string;
}

export interface HorarioMedicoDTO {
  id?: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  duracionSlot?: number;
}

export interface HorarioMedicoResponseDTO {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  duracionSlot: number;
}

export interface MedicoDTO {
  id: string;
  usuarioId: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  username: string;
  specialty: string;
  specialtyId: string;
  shift: 'MANANA' | 'TARDE';
  activo: boolean;
  schedules: HorarioMedicoResponseDTO[];
}

export interface MetricasDashboardDTO {
  totalDoctors: number;
  activeDoctors: number;
  inactiveDoctors: number;
  totalSpecialties: number;
}

export interface DashboardDataDTO {
  doctors: MedicoDTO[];
  metrics: MetricasDashboardDTO;
}

export interface CrearMedicoDTO {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  username: string;
  specialtyId: string;
  shift: 'MANANA' | 'TARDE';
  password: string;
  schedules: HorarioMedicoDTO[];
}

export interface ActualizarMedicoDTO {
  nombre?: string;
  apellido?: string;
  dni?: string;
  email?: string;
  telefono?: string;
  username?: string;
  specialtyId?: string;
  shift?: 'MANANA' | 'TARDE';
  password?: string;
  schedules?: HorarioMedicoDTO[];
}