'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, Sparkles, FileJson } from 'lucide-react';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import FileUploader from '@/components/admin/test-ocr/FileUploader';
import ProcessingState from '@/components/admin/test-ocr/ProcessingState';
import OcrResultsTable from '@/components/admin/test-ocr/OcrResultsTable';
import { uploadFile, processOcrAdmin, getOcrResults, getOcrStatus } from '@/lib/api/ocr.api';
import type { AnalisisResultadoDTO } from '@/lib/api/types';

const TIPOS_ANALISIS = [
  { value: 'SANGRE', label: 'Sangre' },
  { value: 'ORINA', label: 'Orina' },
  { value: 'HECES', label: 'Heces' },
] as const;

// ID del usuario test creado por seed (DNI 99999999)
const PACIENTE_TEST_ID = '702dc3eb-d2cc-442d-b764-4e9f91095182';

export default function TestOcrPage() {
  const { isAuthenticated } = useAdminAuthStore();
  const [archivoId, setArchivoId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [tipoAnalisis, setTipoAnalisis] = useState<'SANGRE' | 'ORINA' | 'HECES'>('SANGRE');
  const [resultId, setResultId] = useState<string | null>(null);
  const [resultado, setResultado] = useState<AnalisisResultadoDTO | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const res = await uploadFile(file, 'ocr-service', PACIENTE_TEST_ID);
      if (!res.success || !res.data?.id) throw new Error('No se pudo subir el archivo');
      return res.data.id as string;
    },
    onSuccess: (id) => {
      setArchivoId(id);
      toast.success('Archivo subido correctamente');
    },
    onError: () => {
      toast.error('Error al subir el archivo');
    },
  });

  const processMutation = useMutation({
    mutationFn: async () => {
      if (!archivoId) throw new Error('No hay archivo');
      const res = await processOcrAdmin({
        archivoId,
        tipoAnalisis,
        pacienteId: PACIENTE_TEST_ID,
      });
      if (!res.success || !res.data?.id) throw new Error(res.error?.mensaje || 'Error al procesar OCR');
      return res.data.id;
    },
    onSuccess: (id) => {
      setResultId(id);
      toast.success('OCR iniciado. Esperando resultados...');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al procesar OCR');
    },
  });

  const { data: statusData } = useQuery({
    queryKey: ['ocr-status', archivoId],
    queryFn: () => getOcrStatus(archivoId!),
    enabled: !!archivoId && !!resultId && !resultado,
    refetchInterval: (query) => {
      const estado = query.state.data?.data?.estadoOcr;
      return estado === 'PROCESANDO' ? 2000 : false;
    },
  });

  const estadoOcr = statusData?.data?.estadoOcr ?? 'NO_PROCESADO';

  useQuery({
    queryKey: ['ocr-result', archivoId],
    queryFn: async () => {
      const res = await getOcrResults(archivoId!);
      if (res.success && res.data) {
        setResultado(res.data);
      }
      return res;
    },
    enabled: estadoOcr === 'COMPLETADO' && !!archivoId && !resultado,
  });

  const handleUpload = (file: File) => {
    setArchivoId(null);
    setResultId(null);
    setResultado(null);
    setUploadedFile({ name: file.name, size: file.size });
    uploadMutation.mutate(file);
  };

  const handleDownloadJson = () => {
    if (!resultado) return;
    const blob = new Blob([JSON.stringify(resultado, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-resultado-${resultado.archivoId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Test OCR — Análisis Clínicos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sube un archivo de análisis clínico, ejecútalo por OCR y visualiza los resultados
          extraídos.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
          <span className="font-medium">Paciente test:</span>
          Test OCR — DNI 99999999 — andres.salesland@gmail.com
        </div>
      </div>

      {/* Upload + Config */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <FileUploader
            onUpload={handleUpload}
            uploading={uploadMutation.isPending}
            uploadedFile={uploadedFile}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de análisis</label>
            <select
              value={tipoAnalisis}
              onChange={(e) => setTipoAnalisis(e.target.value as typeof tipoAnalisis)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
            >
              {TIPOS_ANALISIS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {archivoId && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => processMutation.mutate()}
              disabled={processMutation.isPending || estadoOcr === 'PROCESANDO'}
              className="inline-flex items-center gap-2 rounded-lg bg-[#008585] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#007070] disabled:opacity-50 transition"
            >
              <Sparkles className="h-4 w-4" />
              {processMutation.isPending ? 'Procesando…' : 'Extraer data'}
            </button>

            <button
              onClick={handleDownloadJson}
              disabled={!resultado}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              <FileJson className="h-4 w-4" />
              Descargar JSON
            </button>
          </div>
        )}

        {resultId && (
          <div className="mt-4">
            <ProcessingState
              estado={estadoOcr as any}
              errorOcr={statusData?.data?.errorOcr}
            />
          </div>
        )}
      </div>

      {/* Results */}
      {resultado && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Resultados extraídos</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              {resultado.tipoAnalisis}
            </span>
          </div>
          <OcrResultsTable data={resultado} />
        </div>
      )}
    </div>
  );
}
