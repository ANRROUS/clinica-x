import { api } from './axios';
import type {
  ApiResponse,
  CitaCalendarioDTO,
  ConsultaMedicoDTO,
  PatientSummaryDTO,
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

export async function getDoctorSlotDuration(): Promise<ApiResponse<{ duracionSlot: number }>> {
  const res = await api.get('/api/appointments/doctor/slot-duration');
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
  data: {
    diagnostico: string;
    analysisOrders?: { examName: string; specialty?: string }[];
    medications?: { name: string; days: number; frequency: string }[];
    notas?: string;
  },
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

export async function searchDoctorPatients(
  query: string,
): Promise<ApiResponse<PatientSummaryDTO[]>> {
  const res = await api.get('/api/medical/doctor/patients', { params: { search: query } });
  return res.data;
}

export async function getDoctorPatientDetail(
  patientId: string,
): Promise<ApiResponse<{ patient: PatientSummaryDTO; consultations: ConsultaMedicoDTO[] }>> {
  const res = await api.get(`/api/medical/doctor/patients/${patientId}`);
  return res.data;
}

export async function getConsultationDetail(
  consultationId: string,
): Promise<ApiResponse<ConsultaMedicoDTO>> {
  const res = await api.get(`/api/medical/patient/consultation/${consultationId}`);
  return res.data;
}

export async function sendAIChatMessage(data: {
  consultationId?: string;
  patientId: string;
  message: string;
}): Promise<ApiResponse<{ reply: string }>> {
  const res = await api.post('/api/medical/doctor/ai/chat', data);
  return res.data;
}

export async function getAIChatHistory(
  consultationId: string,
): Promise<ApiResponse<{ messages: { id: string; role: string; content: string; createdAt: string }[] }>> {
  const res = await api.get(`/api/medical/doctor/ai/chat/${consultationId}`);
  return res.data;
}