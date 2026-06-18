'use client';

import { Clock, FileText, Calendar, X } from 'lucide-react';
import { ConsultationListSkeleton } from '@/components/shared/Skeleton';
import type { ConsultaMedicoDTO } from '@/lib/api/types';
import { parseApiDate, formatLima } from '@clinica-x/date-utils';

interface ConsultationListProps {
  consultations: ConsultaMedicoDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  filterDate: string;
  onFilterDateChange: (date: string) => void;
}

export default function ConsultationList({
  consultations,
  selectedId,
  onSelect,
  isLoading,
  filterDate,
  onFilterDateChange,
}: ConsultationListProps) {
  if (isLoading) {
    return <ConsultationListSkeleton />;
  }

  const finishedConsultations = consultations.filter((c) => c.estado === 'FINALIZADA');

  const filteredConsultations = finishedConsultations.filter((c) => {
    if (!filterDate) return true;
    const dateStr = formatLima(parseApiDate(c.fechaInicio), 'yyyy-MM-dd');
    return dateStr === filterDate;
  });

  if (finishedConsultations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileText className="mb-3 h-10 w-10" />
        <p className="text-sm font-medium">Sin consultas registradas</p>
        <p className="text-xs">Este paciente aún no tiene consultas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">
          Filtrar por fecha:
        </h4>
        <div className="relative flex items-center">
          <Calendar className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => onFilterDateChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-9 pr-8 py-1.5 text-xs text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {filterDate && (
            <button
              onClick={() => onFilterDateChange('')}
              className="absolute right-2 text-gray-400 hover:text-gray-600"
              title="Limpiar filtro"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-700">
          Historial de consultas del paciente:
        </h4>
        {filteredConsultations.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-2">No hay consultas para la fecha seleccionada.</p>
        ) : (
          <div className="space-y-2">
            {filteredConsultations.map((c) => {
              const index = finishedConsultations.findIndex((x) => x.id === c.id);
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
                    <span className="text-sm font-medium truncate">
                      Consulta {finishedConsultations.length - index} - {dateStr}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
