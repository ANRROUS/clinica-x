'use client';

import { useMemo, useState } from 'react';
import type { CitaCalendarioDTO } from '@/lib/api/types';
import { parseApiDate } from '@/lib/date-utils';
import {
  nowLima,
  getLimaYear,
  getLimaMonth,
  getLimaDay,
  getLimaDayOfWeek,
  getLimaHours,
  getLimaMinutes,
  buildLimaDate,
} from '@clinica-x/date-utils';
import CalendarDayModal from './CalendarDayModal';

interface CalendarMonthProps {
  currentDate: Date;
  citas: CitaCalendarioDTO[];
  onNavigateToPatient: (patientId: string) => void;
  onDayClick?: (date: Date) => void;
}

const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const statusColors: Record<string, string> = {
  CONFIRMADA: 'bg-blue-light text-blue-dark',
  EN_ATENCION: 'bg-amber-50 text-amber-800',
  COMPLETADA: 'bg-green-50 text-green-800',
  CANCELADA: 'bg-red-50 text-red-800',
};

export default function CalendarMonth({ currentDate, citas, onNavigateToPatient, onDayClick }: CalendarMonthProps) {
  const { daysInMonth, firstDayOffset } = useMemo(() => {
    const year = getLimaYear(currentDate);
    const month = getLimaMonth(currentDate);
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDayOffset: new Date(year, month, 1).getDay(),
    };
  }, [currentDate]);

  const citasByDay = useMemo(() => {
    const map = new Map<number, CitaCalendarioDTO[]>();
    const year = getLimaYear(currentDate);
    const month = getLimaMonth(currentDate);
    citas.forEach((cita) => {
      const d = parseApiDate(cita.fechaHora);
      if (getLimaYear(d) === year && getLimaMonth(d) === month) {
        const day = getLimaDay(d);
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(cita);
      }
    });
    return map;
  }, [citas, currentDate]);

  const [selectedDay, setSelectedDay] = useState<{ date: Date; citas: CitaCalendarioDTO[] } | null>(null);

  const today = nowLima();
  const isCurrentMonth = getLimaYear(today) === getLimaYear(currentDate) && getLimaMonth(today) === getLimaMonth(currentDate);

  return (
    <div className="select-none">
      <div className="grid grid-cols-7 gap-px rounded-t-lg border border-gray-200 bg-gray-100">
        {dayLabels.map((d) => (
          <div key={d} className="bg-brand-500 px-2 py-3 text-center text-xs font-semibold text-white">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px border-x border-b border-gray-200 bg-gray-100">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50 p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayCitas = citasByDay.get(day) || [];
          const isToday = isCurrentMonth && getLimaDay(today) === day;
          return (
            <div
              key={day}
              onClick={() => {
                const clickedDate = buildLimaDate(
                  `${getLimaYear(currentDate)}-${String(getLimaMonth(currentDate) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                );
                setSelectedDay({ date: clickedDate, citas: dayCitas });
              }}
              className={`min-h-[100px] bg-white p-2 cursor-pointer hover:bg-gray-50 ${isToday ? 'ring-2 ring-inset ring-brand-500' : ''}`}
            >
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? 'bg-brand-500 text-white' : 'text-gray-700'}`}>
                {day}
              </span>
              <div className="mt-1 space-y-1">
                {dayCitas.slice(0, 3).map((cita) => {
                  const time = parseApiDate(cita.fechaHora);
                  const h = String(getLimaHours(time)).padStart(2, '0');
                  const m = String(getLimaMinutes(time)).padStart(2, '0');
                  return (
                    <button
                      key={cita.id}
                      onClick={() => onNavigateToPatient(cita.pacienteId)}
                      className={`w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium ${statusColors[cita.estado] || 'bg-gray-100 text-gray-800'} cursor-pointer hover:opacity-80`}
                      title={`${cita.pacienteNombre || ''} ${cita.pacienteApellido || ''} — ${cita.estado}`}
                    >
                      {h}:{m} {cita.pacienteNombre ? `${cita.pacienteNombre.split(' ')[0]}` : 'Paciente'}
                    </button>
                  );
                })}
                {dayCitas.length > 3 && (
                  <span className="text-xs text-gray-500">+{dayCitas.length - 3} más</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <CalendarDayModal
          date={selectedDay.date}
          citas={selectedDay.citas}
          onClose={() => setSelectedDay(null)}
          onNavigateToPatient={(patientId) => {
            setSelectedDay(null);
            onNavigateToPatient(patientId);
          }}
          onGoToDay={(date) => {
            setSelectedDay(null);
            if (onDayClick) onDayClick(date);
          }}
        />
      )}
    </div>
  );
}
