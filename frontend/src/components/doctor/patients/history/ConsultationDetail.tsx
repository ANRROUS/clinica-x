'use client';

import { ArrowLeft, FileText, FlaskConical, Pill } from 'lucide-react';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

interface ConsultationDetailProps {
  consultationId: string;
  onBack: () => void;
}

export default function ConsultationDetail({ consultationId, onBack }: ConsultationDetailProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al chat IA
      </button>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Consulta — Sin datos</h3>
        <p className="text-sm text-gray-500">Detalle de consulta próximamente disponible</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            <h4 className="font-semibold text-gray-900">Diagnóstico</h4>
          </div>
          <p className="text-sm text-gray-500">No hay diagnóstico registrado para esta consulta.</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-indigo-600" />
            <h4 className="font-semibold text-gray-900">Análisis Clínico Derivado</h4>
          </div>
          <p className="text-sm text-gray-500">No hay análisis registrados.</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Pill className="h-4 w-4 text-indigo-600" />
            <h4 className="font-semibold text-gray-900">Medicamentos Asignados</h4>
          </div>
          <p className="text-sm text-gray-500">No hay medicamentos registrados.</p>
        </div>
      </div>
    </div>
  );
}
