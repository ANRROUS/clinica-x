'use client';

import { useMemo } from 'react';
import type { CitaCalendarioDTO } from '@/lib/api/types';

interface CalendarMonthProps {
  currentDate: Date;
  citas: CitaCalendarioDTO[];
  onStartConsultation: (cita: CitaCalendarioDTO) => void;
  onDayClick?: (date: Date) => void;
}

const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const statusColors: Record<string, string> = {
  CONFIRMADA: 'bg-blue-100 text-blue-800',
  EN_ATENCION: 'bg-amber-100 text-amber-800',
  COMPLETADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
};

export default function CalendarMonth({ currentDate, citas, onStartConsultation, onDayClick }: CalendarMonthProps) {
  const { daysInMonth, firstDayOffset } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDayOffset: new Date(year, month, 1).getDay(),
    };
  }, [currentDate]);

  const citasByDay = useMemo(() => {
    const map = new Map<number, CitaCalendarioDTO[]>();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    citas.forEach((cita) => {
      const d = new Date(cita.fechaHora + 'Z');
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(cita);
      }
    });
    return map;
  }, [citas, currentDate]);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth();

  return (
    <div className="select-none">
      <div className="grid grid-cols-7 gap-px rounded-t-lg border border-gray-200 bg-gray-100">
        {dayLabels.map((d) => (
          <div key={d} className="bg-gray-50 px-2 py-3 text-center text-xs font-semibold text-gray-600">
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
          const isToday = isCurrentMonth && today.getDate() === day;
          return (
            <div
              key={day}
              onClick={() => {
                if (dayCitas.length === 0 && onDayClick) {
                  const clickedDate = new Date(currentDate);
                  clickedDate.setDate(day);
                  onDayClick(clickedDate);
                }
              }}
              className={`min-h-[100px] bg-white p-2 ${isToday ? 'ring-2 ring-inset ring-indigo-500' : ''} ${dayCitas.length === 0 && onDayClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            >
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                {day}
              </span>
              <div className="mt-1 space-y-1">
                {dayCitas.slice(0, 3).map((cita) => {
                  const time = new Date(cita.fechaHora + 'Z');
                  const h = time.getHours().toString().padStart(2, '0');
                  const m = time.getMinutes().toString().padStart(2, '0');
                  return (
                    <button
                      key={cita.id}
                      onClick={() => cita.estado === 'CONFIRMADA' && onStartConsultation(cita)}
                      className={`w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium ${statusColors[cita.estado] || 'bg-gray-100 text-gray-800'} ${cita.estado === 'CONFIRMADA' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                      title={`${cita.pacienteNombre || ''} ${cita.pacienteApellido || ''} — ${cita.estado}`}
                    >
                      {h}:{m} {cita.pacienteNombre?.split(' ')[0] || ''}
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
    </div>
  );
}