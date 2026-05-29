import { api } from './axios';
import type {
  ApiResponse,
  EspecialidadDTO,
  DisponibilidadDoctorDTO,
  SlotDTO,
  CitaDTO,
} from './types';

export async function getSpecialties(): Promise<ApiResponse<EspecialidadDTO[]>> {
  const res = await api.get('/api/appointments/specialties');
  return res.data;
}

export async function getAvailabilityBySpecialty(
  especialidadId: string,
): Promise<ApiResponse<DisponibilidadDoctorDTO[]>> {
  const res = await api.get(
    `/api/appointments/availability/specialty/${especialidadId}`,
  );
  return res.data;
}

export async function getAvailabilityByDoctor(
  medicoId: string,
  fecha: string,
): Promise<ApiResponse<SlotDTO[]>> {
  const res = await api.get('/api/appointments/availability', {
    params: { medicoId, fecha },
  });
  return res.data;
}

export async function bookManual(data: {
  medicoId: string;
  fechaHora: string;
  motivo?: string;
}): Promise<ApiResponse<CitaDTO>> {
  const res = await api.post('/api/appointments/book/manual', data);
  return res.data;
}

export async function bookAutomatic(data: {
  especialidadId: string;
  motivo?: string;
}): Promise<ApiResponse<CitaDTO>> {
  const res = await api.post('/api/appointments/book/automatic', data);
  return res.data;
}

export async function getPatientAppointments(): Promise<ApiResponse<CitaDTO[]>> {
  const res = await api.get('/api/appointments/patient/me');
  return res.data;
}

export async function rescheduleAppointment(
  id: string,
  fechaHora: string,
): Promise<ApiResponse<CitaDTO>> {
  const res = await api.put(`/api/appointments/patient/${id}`, { fechaHora });
  return res.data;
}

export async function cancelAppointment(
  id: string,
): Promise<ApiResponse<{ id: string; estado: string }>> {
  const res = await api.delete(`/api/appointments/patient/${id}`);
  return res.data;
}