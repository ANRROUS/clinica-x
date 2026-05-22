'use client';

import { useRef, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileText, Upload, FlaskConical, Pill, CheckCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { getPatientHistory, uploadFile, uploadAnalysisResult, getOcrStatus } from '@/lib/api/medical.api';
import type { ConsultaDTO, AnalysisOrderDTO, MedicationDTO } from '@/lib/api/types';
import { parseApiDate, formatLima, nowLima } from '@clinica-x/date-utils';
import AnalysisResultViewer from './AnalysisResultViewer';
import { getAnalisisDisplayName } from '@/lib/utils';

interface FlatAnalysisOrder {
  order: AnalysisOrderDTO;
  medicoName: string;
  fechaConsulta: string;
}

export default function TreatmentTab() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<AnalysisOrderDTO | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [viewingResult, setViewingResult] = useState<{ archivoId: string; title: string } | null>(null);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['patient-history'],
    queryFn: getPatientHistory,
  });

  const consultations: ConsultaDTO[] = historyData?.data ?? [];

  // Flatten and sort analysis orders from all consultations
  const allAnalysisOrders: FlatAnalysisOrder[] = [];
  consultations.forEach((c) => {
    if (c.analysisOrders) {
      c.analysisOrders.forEach((order) => {
        allAnalysisOrders.push({
          order,
          medicoName: c.medicoNombre || c.medicoApellido ? `Dr. ${c.medicoNombre || ''} ${c.medicoApellido || ''}`.trim() : 'Médico',
          fechaConsulta: c.fechaInicio,
        });
      });
    }
  });
  allAnalysisOrders.sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime());

  // Flatten and filter active medications from all consultations
  const allMedications: (MedicationDTO & { medicoName: string; fechaConsulta: string })[] = [];
  consultations.forEach((c) => {
    if (c.medications) {
      c.medications.forEach((med) => {
        allMedications.push({
          ...med,
          medicoName: c.medicoNombre || c.medicoApellido ? `Dr. ${c.medicoNombre || ''} ${c.medicoApellido || ''}`.trim() : 'Médico',
          fechaConsulta: c.fechaInicio,
        });
      });
    }
  });

  const now = nowLima();
  const activeMedications = allMedications.filter((med) => {
    if (!med.fechaFin) return true;
    const endDate = parseApiDate(med.fechaFin);
    return now <= endDate;
  });

  const checkOcrStatus = useCallback(async (archivoId: string) => {
    try {
      const res = await getOcrStatus(archivoId);
      return res.data?.estadoOcr ?? null;
    } catch {
      return null;
    }
  }, []);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOrder?.id) return;

    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF.');
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error('El PDF debe ser menor a 1MB.');
      return;
    }

    setUploadingId(selectedOrder.id);

    try {
      if (!user?.id) {
        toast.error('Sesión no válida. Inicia sesión de nuevo.');
        setUploadingId(null);
        return;
      }
      const uploadRes = await uploadFile(file, 'clinical-service', user.id);
      if (!uploadRes.success || !uploadRes.data?.id) {
        toast.error('Error al subir el archivo');
        setUploadingId(null);
        return;
      }

      const associateRes = await uploadAnalysisResult(selectedOrder.id, uploadRes.data.id);
      if (!associateRes.success) {
        toast.error('Error al asociar resultado');
        setUploadingId(null);
        return;
      }

      toast.success('PDF guardado correctamente');
      setUploadingId(null);
      setSelectedOrder(null);
      queryClient.invalidateQueries({ queryKey: ['patient-history'] });
    } catch {
      toast.error('Error al subir el archivo');
      setUploadingId(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#008585]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 px-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div>
        <h3 className="text-xl font-bold text-gray-900">Análisis clínicos:</h3>
        <p className="mt-1 text-sm text-gray-600">
          Análisis indicados por tus doctores. Puedes subir el PDF de tus resultados para completarlos.
        </p>

        {allAnalysisOrders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 py-10">
            <FlaskConical className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No tienes análisis indicados</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {allAnalysisOrders.map((item, idx) => {
              const order = item.order;
              const isUploading = uploadingId === order.id;
              const isCompleted = order.estado === 'COMPLETADA';
              const fechaStr = formatLima(parseApiDate(item.fechaConsulta), 'dd/MM/yyyy');

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center rounded-xl border-2 border-[#008585] bg-white p-6 text-center"
                >
                  <p className="text-lg font-semibold text-gray-900">{getAnalisisDisplayName(order.examName)}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.medicoName}</p>
                  <p className="mt-1 text-xs text-gray-400">Fecha consulta: {fechaStr}</p>

                  <div className="mt-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        PDF subido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-3">
                    {!isCompleted ? (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          fileInputRef.current?.click();
                        }}
                        disabled={isUploading}
                        className="flex items-center gap-2 rounded-lg bg-[#008585] px-6 py-2 text-sm font-medium text-white hover:bg-[#007070] transition disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Subir PDF
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setViewingResult({
                            archivoId: order.archivoId!,
                                title: getAnalisisDisplayName(order.examName),
                          });
                        }}
                        className="flex items-center gap-2 rounded-lg bg-[#003F86] px-6 py-2 text-sm font-medium text-white hover:bg-[#002d5e] transition"
                      >
                        <Eye className="h-4 w-4" />
                        Ver resultados
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900">Medicación actual:</h3>
        <p className="mt-1 text-sm text-gray-600">
          Medicamentos correspondientes a tus tratamientos activos actuales:
        </p>

        {activeMedications.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 py-10">
            <Pill className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No tienes medicación activa actualmente</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#008585]">
                  <th className="px-4 py-3 text-left font-semibold text-[#008585]">Nombre</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#008585]">Frecuencia</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#008585]">Duración</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#008585]">Fecha Inicio</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#008585]">Fecha Fin</th>
                </tr>
              </thead>
              <tbody>
                {activeMedications.map((med, idx) => {
                  const inicio = med.fechaInicio ? formatLima(parseApiDate(med.fechaInicio), 'dd/MM/yyyy') : '-';
                  const fin = med.fechaFin ? formatLima(parseApiDate(med.fechaFin), 'dd/MM/yyyy') : '-';
                  return (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-4 py-4 text-gray-800 font-medium">{med.name}</td>
                      <td className="px-4 py-4 text-center text-gray-800">{med.frequency}</td>
                      <td className="px-4 py-4 text-center text-gray-800">{med.days} {med.days === 1 ? 'día' : 'días'}</td>
                      <td className="px-4 py-4 text-center text-gray-800">{inicio}</td>
                      <td className="px-4 py-4 text-center text-gray-800">{fin}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingResult && (
        <AnalysisResultViewer
          archivoId={viewingResult.archivoId}
          title={viewingResult.title}
          onClose={() => setViewingResult(null)}
        />
      )}
    </div>
  );
}
