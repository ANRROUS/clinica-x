import { api } from './axios';
import type { ApiResponse, AnalisisResultadoDTO } from './types';

export interface ProcessOcrAdminInput {
  archivoId: string;
  tipoAnalisis: 'SANGRE' | 'ORINA' | 'HECES';
  pacienteId: string;
  ordenAnalisisId?: string;
  consultaId?: string;
}

export async function processOcrAdmin(
  data: ProcessOcrAdminInput,
): Promise<ApiResponse<{ id: string; archivoId: string; estadoOcr: string }>> {
  const res = await api.post('/api/ocr/admin/process', data);
  return res.data;
}

// Re-exportar funciones existentes del flujo OCR para conveniencia
export { uploadFile } from './medical.api';
export { getOcrResults } from './medical.api';
export { getOcrStatus } from './medical.api';
