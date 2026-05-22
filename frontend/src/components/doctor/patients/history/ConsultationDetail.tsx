'use client';

import { useState } from 'react';
import { FileText, FlaskConical, Pill, CheckCircle, Eye } from 'lucide-react';
import type { ConsultaMedicoDTO } from '@/lib/api/types';
import { parseApiDate, formatLima } from '@clinica-x/date-utils';
import AnalysisResultViewer from '@/components/patient-profile/AnalysisResultViewer';
import { getAnalisisDisplayName } from '@/lib/utils';

interface ConsultationDetailProps {
  consultation: ConsultaMedicoDTO;
  onBack: () => void;
}

export default function ConsultationDetail({ consultation, onBack }: ConsultationDetailProps) {
  const fecha = parseApiDate(consultation.fechaInicio);
  const dateStr = formatLima(fecha, 'dd/MM/yyyy');

  const [viewingArchivoId, setViewingArchivoId] = useState<string | null>(null);
  const [viewingTitle, setViewingTitle] = useState('');

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Consulta — {dateStr}</h3>
          <p className="text-sm text-gray-500">Detalle de consulta finalizada</p>
        </div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          &lt;&lt; Volver a agente
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-500" />
            <h4 className="font-semibold text-gray-900">Diagnóstico</h4>
          </div>
          {consultation.diagnostico ? (
            <textarea
              readOnly
              value={consultation.diagnostico}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none"
              rows={4}
            />
          ) : (
            <p className="text-sm text-gray-500">No hay diagnóstico registrado para esta consulta.</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-brand-500" />
            <h4 className="font-semibold text-gray-900">Análisis Clínico Derivado</h4>
          </div>
          {consultation.analysisOrders && consultation.analysisOrders.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {consultation.analysisOrders.map((order, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-white px-3 py-1.5 text-sm font-medium text-brand-700"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  <span>{getAnalisisDisplayName(order.examName)}</span>
                  {order.estado === 'COMPLETADA' && order.archivoId && (
                    <button
                      onClick={() => {
                        setViewingArchivoId(order.archivoId!);
                        setViewingTitle(getAnalisisDisplayName(order.examName));
                      }}
                      className="ml-1 rounded p-0.5 hover:bg-brand-50 text-brand-600 transition-colors"
                      title="Ver resultados"
                    >
                      <Eye className="h-4 w-4" style={{ color: '#008585' }} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay análisis registrados.</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Pill className="h-4 w-4 text-brand-500" />
            <h4 className="font-semibold text-gray-900">Medicamentos Asignados</h4>
          </div>
          {consultation.medications && consultation.medications.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-brand-500 text-white">
                    <th className="px-4 py-2.5 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-4 py-2.5 text-left text-sm font-semibold">Días</th>
                    <th className="px-4 py-2.5 text-left text-sm font-semibold">Frecuencia</th>
                  </tr>
                </thead>
                <tbody>
                  {consultation.medications.map((med, index) => (
                    <tr
                      key={index}
                      className={`border-t border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{med.name}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{med.days}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{med.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay medicamentos registrados.</p>
          )}
        </div>
      </div>

      {viewingArchivoId && (
        <AnalysisResultViewer
          archivoId={viewingArchivoId}
          title={viewingTitle}
          onClose={() => {
            setViewingArchivoId(null);
            setViewingTitle('');
          }}
        />
      )}
    </div>
  );
}
