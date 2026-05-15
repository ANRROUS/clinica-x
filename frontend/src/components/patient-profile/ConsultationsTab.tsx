'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FileText } from 'lucide-react';
import { getPatientHistory, getConsultationById } from '@/lib/api/medical.api';
import type { ConsultaDTO } from '@/lib/api/types';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function ConsultationsTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
  const isActive = selectedConsultation?.estado === 'ACTIVA';

  if (loadingHistory) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
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
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 font-semibold text-gray-800">Historial de consultas</h3>
        <div className="space-y-2">
          {consultations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                selectedId === c.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-300'
              }`}
            >
              <p className="font-medium text-gray-900">{c.motivoConsulta || 'Consulta médica'}</p>
              <p className="text-sm text-gray-500">Fecha: {formatDate(c.fechaInicio)}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  c.estado === 'ACTIVA'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {c.estado === 'ACTIVA' ? 'Activa' : 'Finalizada'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        {!selectedId ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center">
            <FileText className="h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">Selecciona una consulta para ver el detalle.</p>
          </div>
        ) : loadingDetail ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        ) : selectedConsultation ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">Tu Diagnóstico</h3>
            <p className="mb-3 text-sm text-gray-500">Este es el diagnóstico que el doctor te recetó</p>
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {selectedConsultation.diagnostico ? (
                <p className="text-sm text-gray-700">{selectedConsultation.diagnostico}</p>
              ) : (
                <p className="text-sm italic text-gray-400">
                  {isActive ? 'El diagnóstico aún no ha sido ingresado.' : 'Sin diagnóstico registrado.'}
                </p>
              )}
            </div>

            {selectedConsultation.notas && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800">Notas</h4>
                <p className="mt-1 text-sm text-gray-600">{selectedConsultation.notas}</p>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p><span className="font-medium">Estado:</span> {selectedConsultation.estado === 'ACTIVA' ? 'Activa' : 'Finalizada'}</p>
              <p><span className="font-medium">Fecha:</span> {formatDate(selectedConsultation.fechaInicio)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}