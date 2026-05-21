'use client';

import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileText, Upload, FlaskConical, Pill, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getPatientHistory, uploadFile, uploadAnalysisResult } from '@/lib/api/medical.api';
import type { ConsultaDTO, AnalysisOrderDTO } from '@/lib/api/types';

interface UploadingState {
  analysisOrderId: string;
  status: 'uploading' | 'associating' | 'done';
}

export default function TreatmentTab() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<AnalysisOrderDTO | null>(null);
  const [uploadingState, setUploadingState] = useState<UploadingState | null>(null);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['patient-history'],
    queryFn: getPatientHistory,
  });

  const consultations: ConsultaDTO[] = historyData?.data ?? [];
  const lastFinalized = [...consultations]
    .reverse()
    .find((c) => c.estado === 'FINALIZADA');

  const analysisOrders = lastFinalized?.analysisOrders ?? [];
  const medications = lastFinalized?.medications ?? [];

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOrder?.id) return;

    // Validar tipo y tamaño
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
    const MAX_SIZE = 10 * 1024 * 1024;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Formato no permitido. Solo PDF, JPG o PNG.');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('El archivo supera los 10MB.');
      return;
    }

    try {
      setUploadingState({ analysisOrderId: selectedOrder.id, status: 'uploading' });

      const uploadRes = await uploadFile(file);
      if (!uploadRes.success || !uploadRes.data?.id) {
        toast.error('Error al subir archivo');
        setUploadingState(null);
        return;
      }

      setUploadingState({ analysisOrderId: selectedOrder.id, status: 'associating' });

      const associateRes = await uploadAnalysisResult(selectedOrder.id, uploadRes.data.id);
      if (!associateRes.success) {
        toast.error('Error al asociar resultado');
        setUploadingState(null);
        return;
      }

      toast.success('Análisis subido correctamente');
      setUploadingState(null);
      setSelectedOrder(null);
      queryClient.invalidateQueries({ queryKey: ['patient-history'] });
    } catch {
      toast.error('Error al subir el archivo');
      setUploadingState(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUploading = (orderId: string) =>
    uploadingState?.analysisOrderId === orderId && uploadingState.status !== 'done';

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#008585]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 px-2">
      {/* File input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Análisis a realizar */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Análisis a realizar:</h3>
        <p className="mt-1 text-sm text-gray-600">
          {lastFinalized
            ? 'El doctor en tu última consulta te ha asignado realizarte los siguientes análisis, puedes reservar o subirlo en PDF'
            : 'No tienes consultas finalizadas aún.'}
        </p>

        {analysisOrders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 py-10">
            <FlaskConical className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No tienes análisis pendientes</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {analysisOrders.map((order, idx) => {
              const uploading = isUploading(order.id!);
              const isDone = uploadingState?.analysisOrderId === order.id && uploadingState?.status === 'done';
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center rounded-xl border-2 border-[#008585] bg-white p-6"
                >
                  <p className="text-lg font-semibold text-gray-900">{order.examName}</p>
                  {order.specialty && (
                    <p className="mt-1 text-xs text-gray-500">{order.specialty}</p>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button
                      className="rounded-lg bg-[#008585] px-6 py-2 text-sm font-medium text-white hover:bg-[#007070] transition"
                      title="Reservar cita para este análisis (próximamente)"
                    >
                      Reservar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        fileInputRef.current?.click();
                      }}
                      disabled={uploading}
                      className="flex items-center gap-2 rounded-lg bg-[#008585] px-6 py-2 text-sm font-medium text-white hover:bg-[#007070] transition disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Subiendo...
                        </>
                      ) : isDone ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Subido
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Subir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Medicación actual */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Medicación actual:</h3>
        <p className="mt-1 text-sm text-gray-600">
          {lastFinalized
            ? 'El doctor en tu última consulta te ha asignado la siguiente medicación:'
            : ''}
        </p>

        {medications.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 py-10">
            <Pill className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No tienes medicación asignada actualmente</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#008585]">
                  <th className="px-4 py-3 text-left font-semibold text-[#008585]">Nombre</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#008585]">N° Días</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#008585]">Frecuencia</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-4 py-4 text-gray-800">{med.name}</td>
                    <td className="px-4 py-4 text-center text-gray-800">{med.days}</td>
                    <td className="px-4 py-4 text-center text-gray-800">{med.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
