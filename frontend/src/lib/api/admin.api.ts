import { api } from './axios';
import type {
  ApiResponse,
  MedicoDTO,
  DashboardDataDTO,
  CrearMedicoDTO,
  ActualizarMedicoDTO,
  EspecialidadDTO,
} from './types';

export async function getAdminDashboard(): Promise<ApiResponse<DashboardDataDTO>> {
  const res = await api.get('/api/admin/doctors');
  return res.data;
}

export async function getAdminDoctors(): Promise<ApiResponse<DashboardDataDTO>> {
  const res = await api.get('/api/admin/doctors');
  return res.data;
}

export async function getAdminDoctor(id: string): Promise<ApiResponse<{ doctor: MedicoDTO }>> {
  const res = await api.get(`/api/admin/doctors/${id}`);
  return res.data;
}

export async function createDoctor(data: CrearMedicoDTO): Promise<ApiResponse<{ doctor: MedicoDTO }>> {
  const res = await api.post('/api/admin/doctors', data);
  return res.data;
}

export async function updateDoctor(
  id: string,
  data: ActualizarMedicoDTO,
): Promise<ApiResponse<{ doctor: MedicoDTO }>> {
  const res = await api.put(`/api/admin/doctors/${id}`, data);
  return res.data;
}

export async function toggleDoctorStatus(
  id: string,
  activo: boolean,
): Promise<ApiResponse<{ id: string; activo: boolean }>> {
  const res = await api.patch(`/api/admin/doctors/${id}/status`, { activo });
  return res.data;
}

export async function getSpecialties(): Promise<ApiResponse<EspecialidadDTO[]>> {
  const res = await api.get('/api/appointments/specialties');
  return res.data;
}