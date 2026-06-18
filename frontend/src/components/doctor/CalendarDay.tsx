'use client';

import { useMemo } from 'react';
import { Clock, User } from 'lucide-react';
import type { CitaCalendarioDTO } from '@/lib/api/types';
import { parseApiDate } from '@/lib/date-utils';
import {
  getLimaYear,
  getLimaMonth,
  getLimaDay,
  getLimaDayOfWeek,
  getLimaHours,
  getLimaMinutes,
  formatLima,
} from '@clinica-x/date-utils';

interface CalendarDayProps {
  currentDate: Date;
  citas: CitaCalendarioDTO[];
  onNavigateToPatient: (patientId: string) => void;
}

const statusBadge: Record<string, string> = {
  CONFIRMADA: 'bg-blue-light border-blue-200 text-blue-dark',
  EN_ATENCION: 'bg-amber-50 border-amber-200 text-amber-800',
  COMPLETADA: 'bg-green-50 border-green-200 text-green-800',
  CANCELADA: 'bg-red-50 border-red-200 text-red-700',
};

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarDay({ currentDate, citas, onNavigateToPatient }: CalendarDayProps) {
  const dayCitas = useMemo(() => {
    const dateStr = formatLima(currentDate, 'yyyy-MM-dd');
    return citas
      .filter((c) => {
        const d = parseApiDate(c.fechaHora);
        return !isNaN(d.getTime()) && formatLima(d, 'yyyy-MM-dd') === dateStr;
      })
      .sort((a, b) => parseApiDate(a.fechaHora).getTime() - parseApiDate(b.fechaHora).getTime());
  }, [citas, currentDate]);

  const dateLabel = `${dayNames[getLimaDayOfWeek(currentDate) % 7]} ${getLimaDay(currentDate)} de ${monthNames[getLimaMonth(currentDate)]}`;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{dateLabel}</h3>
      </div>

      {dayCitas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Clock className="mb-3 h-12 w-12" />
          <p className="text-lg font-medium">Sin citas para este día</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {dayCitas.map((cita) => {
            const start = parseApiDate(cita.fechaHora);
            if (isNaN(start.getTime())) return null;
            const hStart = String(getLimaHours(start)).padStart(2, '0');
            const mStart = String(getLimaMinutes(start)).padStart(2, '0');
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
                      <p className="font-semibold">{cita.pacienteNombre ? `${cita.pacienteNombre} ${cita.pacienteApellido || ''}`.trim() : 'Paciente'}</p>
                      <p className="text-sm opacity-75">{cita.specialty || cita.especialidad || '—'}</p>
                      <p className="text-xs opacity-60">{hStart}:{mStart} – {hEnd}:{mEnd}</p>
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
  );
}
