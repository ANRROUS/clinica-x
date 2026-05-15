'use client';

import { useMemo } from 'react';
import { Clock, User, Stethoscope, XCircle, CheckCircle } from 'lucide-react';
import type { CitaCalendarioDTO } from '@/lib/api/types';

interface CalendarDayProps {
  currentDate: Date;
  citas: CitaCalendarioDTO[];
  onStatusChange: (id: string, estado: 'CONFIRMADA' | 'EN_ATENCION' | 'COMPLETADA' | 'CANCELADA') => void;
  onStartConsultation: (cita: CitaCalendarioDTO) => void;
}

const statusBadge: Record<string, string> = {
  CONFIRMADA: 'bg-blue-50 border-blue-200 text-blue-800',
  EN_ATENCION: 'bg-amber-50 border-amber-200 text-amber-800',
  COMPLETADA: 'bg-green-50 border-green-200 text-green-800',
  CANCELADA: 'bg-red-50 border-red-200 text-red-700',
};

const statusLabel: Record<string, string> = {
  CONFIRMADA: 'Confirmada',
  EN_ATENCION: 'En Atención',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarDay({ currentDate, citas, onStatusChange, onStartConsultation }: CalendarDayProps) {
  const dayCitas = useMemo(() => {
    const dateStr = currentDate.toISOString().slice(0, 10);
    return citas
      .filter((c) => {
        const d = new Date(c.fechaHora + 'Z');
        return d.toISOString().slice(0, 10) === dateStr;
      })
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
  }, [citas, currentDate]);

  const dateLabel = `${dayNames[currentDate.getDay()]} ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`;

  const totalByStatus = useMemo(() => {
    const counts: Record<string, number> = { CONFIRMADA: 0, EN_ATENCION: 0, COMPLETADA: 0, CANCELADA: 0 };
    dayCitas.forEach((c) => { counts[c.estado] = (counts[c.estado] || 0) + 1; });
    return counts;
  }, [dayCitas]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{dateLabel}</h3>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1 text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Confirmadas: {totalByStatus.CONFIRMADA}
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> En atención: {totalByStatus.EN_ATENCION}
          </span>
          <span className="flex items-center gap-1 text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Completadas: {totalByStatus.COMPLETADA}
          </span>
          <span className="flex items-center gap-1 text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Canceladas: {totalByStatus.CANCELADA}
          </span>
        </div>
      </div>

      {dayCitas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Clock className="mb-3 h-12 w-12" />
          <p className="text-lg font-medium">Sin citas para este día</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayCitas.map((cita) => {
            const start = new Date(cita.fechaHora + 'Z');
            const hStart = start.getHours().toString().padStart(2, '0');
            const mStart = start.getMinutes().toString().padStart(2, '0');
            const end = new Date(start.getTime() + 30 * 60000);
            const hEnd = end.getHours().toString().padStart(2, '0');
            const mEnd = end.getMinutes().toString().padStart(2, '0');
            return (
              <div
                key={cita.id}
                className={`rounded-lg border p-4 ${statusBadge[cita.estado] || 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800">
                      {hStart}:{mStart}
                    </div>
                    <div>
                      <p className="font-semibold">{cita.pacienteNombre || 'Paciente'} {cita.pacienteApellido || ''}</p>
                      <p className="text-sm opacity-75">{cita.specialty || cita.especialidad || '—'}</p>
                      <p className="text-xs opacity-60">{hStart}:{mStart} – {hEnd}:{mEnd}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
                    {statusLabel[cita.estado]}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {cita.estado === 'CONFIRMADA' && (
                    <>
                      <button
                        onClick={() => onStatusChange(cita.id, 'EN_ATENCION')}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors"
                      >
                        <Stethoscope className="h-3 w-3" />
                        Iniciar atención
                      </button>
                      <button
                        onClick={() => onStartConsultation(cita)}
                        className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-800 hover:bg-indigo-200 transition-colors"
                      >
                        <Stethoscope className="h-3 w-3" />
                        Iniciar consulta
                      </button>
                    </>
                  )}
                  {cita.estado === 'EN_ATENCION' && (
                    <button
                      onClick={() => onStatusChange(cita.id, 'COMPLETADA')}
                      className="inline-flex items-center gap-1 rounded-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Completar
                    </button>
                  )}
                  {(cita.estado === 'CONFIRMADA' || cita.estado === 'EN_ATENCION') && (
                    <button
                      onClick={() => onStatusChange(cita.id, 'CANCELADA')}
                      className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="h-3 w-3" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}