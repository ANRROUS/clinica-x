'use client';

import { Clock, FileText } from 'lucide-react';
import type { ConsultaMedicoDTO } from '@/lib/api/types';
import { parseApiDate, formatLima } from '@clinica-x/date-utils';

interface ConsultationListProps {
  consultations: ConsultaMedicoDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export default function ConsultationList({
  consultations,
  selectedId,
  onSelect,
  isLoading,
}: ConsultationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileText className="mb-3 h-10 w-10" />
        <p className="text-sm font-medium">Sin consultas registradas</p>
        <p className="text-xs">Este paciente aún no tiene consultas registradas</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-gray-700">
        Historial de consultas del paciente:
      </h4>
      <div className="space-y-2">
        {consultations
          .filter((c) => c.estado === 'FINALIZADA')
          .map((c, index) => {
            const fecha = parseApiDate(c.fechaInicio);
            const dateStr = formatLima(fecha, 'dd/MM/yy');
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-colors ${
                  selectedId === c.id
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-brand-500 bg-white text-brand-500 hover:bg-brand-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${selectedId === c.id ? 'text-white' : 'text-brand-500'}`} />
                  <span className="text-sm font-medium">
                    Consulta {consultations.length - index} - {dateStr}
                  </span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
