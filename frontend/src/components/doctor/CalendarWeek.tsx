'use client';

import { useMemo } from 'react';
import { Clock, User } from 'lucide-react';
import type { CitaCalendarioDTO } from '@/lib/api/types';

interface CalendarWeekProps {
  currentDate: Date;
  citas: CitaCalendarioDTO[];
  onStatusChange: (id: string, estado: 'CONFIRMADA' | 'EN_ATENCION' | 'COMPLETADA' | 'CANCELADA') => void;
  onStartConsultation: (cita: CitaCalendarioDTO) => void;
}

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const statusBadge: Record<string, string> = {
  CONFIRMADA: 'bg-blue-100 text-blue-800 border-blue-200',
  EN_ATENCION: 'bg-amber-100 text-amber-800 border-amber-200',
  COMPLETADA: 'bg-green-100 text-green-700 border-green-200',
  CANCELADA: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabel: Record<string, string> = {
  CONFIRMADA: 'Confirmada',
  EN_ATENCION: 'En atención',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

export default function CalendarWeek({ currentDate, citas, onStatusChange, onStartConsultation }: CalendarWeekProps) {
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const citasByDay = useMemo(() => {
    const map = new Map<string, CitaCalendarioDTO[]>();
    weekDays.forEach((day) => {
      const key = day.toISOString().slice(0, 10);
      map.set(key, []);
    });
    citas.forEach((cita) => {
      const d = new Date(cita.fechaHora + 'Z');
      const key = d.toISOString().slice(0, 10);
      if (map.has(key)) {
        map.get(key)!.push(cita);
      }
    });
    return map;
  }, [citas, weekDays]);

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let h = 7; h <= 20; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-gray-200 bg-white">
          <div className="border-r border-gray-100 p-2" />
          {weekDays.map((day) => {
            const key = day.toISOString().slice(0, 10);
            const isToday = key === todayKey;
            const dayCitas = citasByDay.get(key) || [];
            return (
              <div key={key} className={`border-r border-gray-100 p-2 text-center ${isToday ? 'bg-indigo-50' : ''}`}>
                <p className="text-xs font-medium text-gray-500">{dayNames[day.getDay()]}</p>
                <p className={`mt-0.5 text-lg font-bold ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </p>
                {dayCitas.length > 0 && (
                  <span className="mt-1 inline-block rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                    {dayCitas.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative">
          {timeSlots.map((time) => {
            const hour = parseInt(time.split(':')[0], 10);
            return (
              <div key={time} className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-gray-100">
                <div className="border-r border-gray-100 p-1 text-right text-xs text-gray-400">
                  {time}
                </div>
                {weekDays.map((day) => {
                  const key = day.toISOString().slice(0, 10);
                  const dayCitas = citasByDay.get(key) || [];
                  const slotCitas = dayCitas.filter((c) => {
                    const ch = new Date(c.fechaHora + 'Z').getHours();
                    return ch === hour;
                  });
                  return (
                    <div key={`${key}-${time}`} className="min-h-[50px] border-r border-gray-50 p-0.5">
                      {slotCitas.map((cita) => {
                        const start = new Date(cita.fechaHora + 'Z');
                        const h = start.getHours().toString().padStart(2, '0');
                        const m = start.getMinutes().toString().padStart(2, '0');
                        return (
                          <button
                            key={cita.id}
                            onClick={() => onStartConsultation(cita)}
                            className={`mb-0.5 w-full rounded border p-1 text-left text-xs transition-shadow hover:shadow-md ${statusBadge[cita.estado] || 'bg-gray-100'}`}
                          >
                            <div className="flex items-center gap-1 font-medium">
                              <Clock className="h-3 w-3" />
                              {h}:{m}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 truncate">
                              <User className="h-3 w-3 shrink-0" />
                              <span className="truncate">{cita.pacienteNombre || cita.pacienteId?.slice(0, 8)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}