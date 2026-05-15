import { api } from './axios';
import type {
  ApiResponse,
  CitaCalendarioDTO,
  ConsultaMedicoDTO,
} from './types';

export async function getDoctorCalendar(params?: {
  desde?: string;
  hasta?: string;
}): Promise<ApiResponse<CitaCalendarioDTO[]>> {
  const res = await api.get('/api/appointments/doctor/calendar', { params });
  return res.data;
}

export async function changeAppointmentStatus(
  id: string,
  estado: 'CONFIRMADA' | 'EN_ATENCION' | 'COMPLETADA' | 'CANCELADA',
): Promise<ApiResponse<CitaCalendarioDTO>> {
  const res = await api.patch(`/api/appointments/doctor/${id}/status`, { estado });
  return res.data;
}

export async function startConsultation(data: {
  pacienteId: string;
  citaId?: string;
  motivoConsulta?: string;
}): Promise<ApiResponse<ConsultaMedicoDTO>> {
  const res = await api.post('/api/medical/doctor/consultation/start', data);
  return res.data;
}

export async function finalizeConsultation(
  id: string,
  data: { diagnostico?: string; notas?: string },
): Promise<ApiResponse<ConsultaMedicoDTO>> {
  const res = await api.post(`/api/medical/doctor/consultation/${id}/finalize`, data);
  return res.data;
}

export async function getActivePatient(): Promise<ApiResponse<ConsultaMedicoDTO | null>> {
  const res = await api.get('/api/medical/doctor/active-patient');
  return res.data;
}

export async function getDoctorPatients(params?: {
  desde?: string;
  hasta?: string;
}): Promise<ApiResponse<ConsultaMedicoDTO[]>> {
  const res = await api.get('/api/medical/doctor/patients', { params });
  return res.data;
}