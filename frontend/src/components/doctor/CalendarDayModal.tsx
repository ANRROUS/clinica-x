'use client';

import { useMemo } from 'react';
import { X, Clock, User } from 'lucide-react';
import type { CitaCalendarioDTO } from '@/lib/api/types';
import { parseApiDate } from '@/lib/date-utils';
import {
  getLimaHours,
  getLimaMinutes,
  getLimaDayOfWeek,
  getLimaDay,
  getLimaMonth,
  getLimaYear,
  formatLima,
} from '@clinica-x/date-utils';

interface CalendarDayModalProps {
  date: Date;
  citas: CitaCalendarioDTO[];
  onClose: () => void;
  onNavigateToPatient: (patientId: string) => void;
  onGoToDay: (date: Date) => void;
}

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const statusBadge: Record<string, string> = {
  CONFIRMADA: 'bg-blue-light text-blue-dark border-blue-200',
  EN_ATENCION: 'bg-amber-50 text-amber-800 border-amber-200',
  COMPLETADA: 'bg-green-50 text-green-700 border-green-200',
  CANCELADA: 'bg-red-50 text-red-700 border-red-200',
};

export default function CalendarDayModal({
  date,
  citas,
  onClose,
  onNavigateToPatient,
  onGoToDay,
}: CalendarDayModalProps) {
  const sortedCitas = useMemo(() => {
    return [...citas].sort((a, b) => {
      const da = parseApiDate(a.fechaHora);
      const db = parseApiDate(b.fechaHora);
      return da.getTime() - db.getTime();
    });
  }, [citas]);

  const dateLabel = `${dayNames[getLimaDayOfWeek(date) % 7]}, ${getLimaDay(date)} de ${monthNames[getLimaMonth(date)]} ${getLimaYear(date)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{dateLabel}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {sortedCitas.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <Clock className="mb-3 h-10 w-10" />
              <p className="text-base font-medium">Sin citas para este día</p>
              <button
                onClick={() => onGoToDay(date)}
                className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Ir a vista diaria
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCitas.map((cita) => {
                const start = parseApiDate(cita.fechaHora);
                const h = String(getLimaHours(start)).padStart(2, '0');
                const m = String(getLimaMinutes(start)).padStart(2, '0');
                const end = new Date(start.getTime() + 30 * 60000);
                const hEnd = String(getLimaHours(end)).padStart(2, '0');
                const mEnd = String(getLimaMinutes(end)).padStart(2, '0');
                return (
              <div
                key={cita.id}
                className={`rounded-lg border p-4 ${statusBadge[cita.estado] || 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                      {(cita.pacienteNombre?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {cita.pacienteNombre ? `${cita.pacienteNombre} ${cita.pacienteApellido || ''}`.trim() : 'Paciente'}
                      </p>
                      <p className="text-sm text-gray-500">{cita.specialty || cita.especialidad || '—'}</p>
                      <p className="text-xs text-gray-400">{h}:{m} – {hEnd}:{mEnd}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    {cita.estado !== 'COMPLETADA' && cita.estado !== 'CANCELADA' && (
                      <button
                        onClick={() => onNavigateToPatient(cita.pacienteId)}
                        className="inline-flex items-center gap-1 rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
                      >
                        <User className="h-3 w-3" />
                        Ver paciente
                      </button>
                    )}
                  </div>
                </div>
              </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
