'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FileText, Search, Check, Eye } from 'lucide-react';
import { getPatientHistory, getConsultationById } from '@/lib/api/medical.api';
import type { ConsultaDTO, AnalysisOrderDTO, MedicationDTO } from '@/lib/api/types';
import { parseLimaDate, getLimaDay, getLimaMonth, getLimaYear } from '@clinica-x/date-utils';
import AnalysisResultViewer from './AnalysisResultViewer';
import { getAnalisisDisplayName } from '@/lib/utils';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatDate(iso: string): string {
  const d = parseLimaDate(iso);
  return `${getLimaDay(d)} de ${MONTH_NAMES[getLimaMonth(d)]} de ${getLimaYear(d)}`;
}

export default function ConsultationsTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState('');
  const [viewingResult, setViewingResult] = useState<{ archivoId: string; title: string } | null>(null);

  const { data: historyData, isLoading: loadingHistory } = useQuery({
    queryKey: ['patient-history'],
    queryFn: getPatientHistory,
  });

  const consultations: ConsultaDTO[] = historyData?.data ?? [];

  const { data: detailData, isLoading: loadingDetail } = useQuery({
    queryKey: ['consultation', selectedId],
    queryFn: () => getConsultationById(selectedId!),
    enabled: !!selectedId,
  });

  const selectedConsultation = detailData?.data;

  const analysisOrders: AnalysisOrderDTO[] = selectedConsultation?.analysisOrders ?? [];
  const medications: MedicationDTO[] = selectedConsultation?.medications ?? [];

  if (loadingHistory) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#008585]" />
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-4 text-gray-500">Aún no tienes consultas registradas.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      {/* Columna izquierda - Historial */}
      <div>
        <p className="mb-3 text-sm text-gray-700">Historial de consultas del paciente:</p>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="  /     /"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-[#008585] focus:outline-none"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#008585]" />
        </div>
        <div className="space-y-3">
          {consultations.map((c) => {
            const isSelected = selectedId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  isSelected
                    ? 'border-[#008585] bg-[#008585] text-white'
                    : 'border-[#008585] bg-white text-gray-700 hover:bg-[#008585]/5'
                }`}
              >
                <p className={`font-medium ${isSelected ? 'text-white' : 'text-[#008585]'}`}>
                  Consulta #{c.id.slice(0, 8)}
                </p>
                <p className={`mt-1 text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  Fecha: {formatDate(c.fechaInicio)}
                </p>
                <p className={`mt-1 text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  Estado: {c.estado === 'FINALIZADA' ? 'Finalizada' : 'Activa'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Columna derecha - Detalle */}
      <div>
        {!selectedId ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center">
            <FileText className="h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">Selecciona una consulta para ver el detalle.</p>
          </div>
        ) : loadingDetail ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#008585]" />
          </div>
        ) : selectedConsultation ? (
          <div className="space-y-8">
            {/* Diagnóstico */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tu Diagnóstico</h3>
              <p className="mb-3 text-sm text-gray-500">Este es el diagnóstico que el doctor te recetó</p>
              <div className="rounded-xl border-2 border-[#008585] bg-white p-6">
                {selectedConsultation.diagnostico ? (
                  <p className="text-sm text-gray-700">{selectedConsultation.diagnostico}</p>
                ) : (
                  <p className="text-sm italic text-gray-400">
                    {selectedConsultation.estado === 'ACTIVA'
                      ? 'El paciente presentó ...'
                      : 'Sin diagnóstico registrado.'}
                  </p>
                )}
              </div>
            </div>

            {analysisOrders.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tu Análisis Clínico</h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Análisis solicitados durante la consulta
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {analysisOrders.map((order, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-full border border-[#008585] bg-white px-4 py-2 text-sm text-gray-800"
                      >
                        <span>{getAnalisisDisplayName(order.examName)}</span>
                        {order.estado === 'COMPLETADA' && order.archivoId ? (
                          <button
                            onClick={() => {
                              setViewingResult({
                                archivoId: order.archivoId!,
                                title: getAnalisisDisplayName(order.examName),
                              });
                            }}
                            className="ml-1 rounded p-0.5 hover:bg-gray-100 text-[#008585] transition-colors"
                            title="Ver resultados"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#008585]">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {medications.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tus Medicamentos</h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Medicamentos recetados durante la consulta
                  </p>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#008585] text-white">
                          <th className="px-4 py-3 text-center font-medium">Nombre</th>
                          <th className="px-4 py-3 text-center font-medium">Días</th>
                          <th className="px-4 py-3 text-center font-medium">Frecuencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medications.map((med, idx) => (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-4 py-3 text-center text-gray-700">{med.name}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{med.days}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{med.frequency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
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
