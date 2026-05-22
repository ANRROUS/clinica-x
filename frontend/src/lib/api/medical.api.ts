import { api } from './axios';
import type { ApiResponse, ConsultaDTO } from './types';

export interface CatalogoMedicamento {
  id: string;
  nombre: string;
  activo: boolean;
  createdAt: string;
}

export async function getMedicationCatalog(): Promise<ApiResponse<CatalogoMedicamento[]>> {
  const res = await api.get('/api/medical/catalogos/medicamentos');
  return res.data;
}

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
  formData.append('file', file);
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

export async function uploadAnalysisResult(
  analysisOrderId: string,
  archivoId: string,
): Promise<ApiResponse<any>> {
  const res = await api.post('/api/medical/patient/analysis-results', {
    analysisOrderId,
    archivoId,
  });
  return res.data;
}

export async function getOcrResults(
  archivoId: string,
): Promise<ApiResponse<import('./types').AnalisisResultadoDTO>> {
  const res = await api.get(`/api/ocr/results/${archivoId}`);
  return res.data;
}

export async function getOcrResultByOrder(
  ordenAnalisisId: string,
): Promise<ApiResponse<import('./types').AnalisisResultadoDTO>> {
  const res = await api.get(`/api/ocr/results/order/${ordenAnalisisId}`);
  return res.data;
}

export async function getOcrStatus(
  archivoId: string,
): Promise<ApiResponse<{ archivoId: string; estadoOcr: string; errorOcr?: string }>> {
  const res = await api.get(`/api/ocr/status/${archivoId}`);
  return res.data;
}