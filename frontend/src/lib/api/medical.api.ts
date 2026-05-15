import { api } from './axios';
import type { ApiResponse, ConsultaDTO } from './types';

export async function getPatientHistory(): Promise<ApiResponse<ConsultaDTO[]>> {
  const res = await api.get('/api/medical/patient/history');
  return res.data;
}

export async function getConsultationById(
  id: string,
): Promise<ApiResponse<ConsultaDTO>> {
  const res = await api.get(`/api/medical/patient/consultation/${id}`);
  return res.data;
}

export async function uploadFile(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append('archivo', file);
  const res = await api.post('/api/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getFileSignedUrl(
  id: string,
): Promise<ApiResponse<{ url: string }>> {
  const res = await api.get(`/api/files/${id}/signed-url`);
  return res.data;
}