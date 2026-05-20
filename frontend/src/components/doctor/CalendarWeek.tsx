'use client';

import { useMemo } from 'react';
import { Clock, User } from 'lucide-react';
import type { CitaCalendarioDTO } from '@/lib/api/types';
import { parseApiDate } from '@/lib/date-utils';
import {
  nowLima,
  addDaysLima,
  getLimaDayOfWeek,
  getLimaDay,
  getLimaHours,
  getLimaMinutes,
  formatLima,
} from '@clinica-x/date-utils';

interface CalendarWeekProps {
  currentDate: Date;
  citas: CitaCalendarioDTO[];
  onNavigateToPatient: (patientId: string) => void;
}

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const statusBadge: Record<string, string> = {
  CONFIRMADA: 'bg-blue-light text-blue-dark border-blue-200',
  EN_ATENCION: 'bg-amber-50 text-amber-800 border-amber-200',
  COMPLETADA: 'bg-green-50 text-green-700 border-green-200',
  CANCELADA: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabel: Record<string, string> = {
  CONFIRMADA: 'Confirmada',
  EN_ATENCION: 'En atención',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

export default function CalendarWeek({ currentDate, citas, onNavigateToPatient }: CalendarWeekProps) {
  const weekDays = useMemo(() => {
    const day = getLimaDayOfWeek(currentDate);
    const diff = day === 7 ? -6 : 1 - day; // 7 = Domingo en nuestro sistema
    const startOfWeek = addDaysLima(currentDate, diff);
    return Array.from({ length: 7 }).map((_, i) => addDaysLima(startOfWeek, i));
  }, [currentDate]);

  const citasByDay = useMemo(() => {
    const map = new Map<string, CitaCalendarioDTO[]>();
    weekDays.forEach((day) => {
      const key = formatLima(day, 'yyyy-MM-dd');
      map.set(key, []);
    });
    citas.forEach((cita) => {
      const d = parseApiDate(cita.fechaHora);
      const key = isNaN(d.getTime()) ? '' : formatLima(d, 'yyyy-MM-dd');
      if (!key) return;
      if (map.has(key)) {
        map.get(key)!.push(cita);
      }
    });
    return map;
  }, [citas, weekDays]);

  const today = nowLima();
  const todayKey = formatLima(today, 'yyyy-MM-dd');

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let h = 7; h <= 20; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1100px]">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          <div className="bg-brand-500 p-2 text-center text-xs font-semibold text-white">
            Hora
          </div>
          {weekDays.map((day) => {
            const key = formatLima(day, 'yyyy-MM-dd');
            const isToday = key === todayKey;
            const dayCitas = citasByDay.get(key) || [];
            return (
              <div key={key} className={`bg-brand-500 p-2 text-center ${isToday ? 'bg-brand-600' : ''}`}>
                <p className="text-xs font-medium text-white">{dayNames[getLimaDayOfWeek(day) % 7]}</p>
                <p className={`mt-0.5 text-lg font-bold text-white`}>
                  {getLimaDay(day)}
                </p>
                {dayCitas.length > 0 && (
                  <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs text-brand-500">
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
              <div key={time} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100">
                <div className="bg-brand-500 p-1 text-right text-xs font-medium text-white">
                  {time}
                </div>
                {weekDays.map((day) => {
                  const key = formatLima(day, 'yyyy-MM-dd');
                  const dayCitas = citasByDay.get(key) || [];
                  const slotCitas = dayCitas.filter((c) => {
                    const ch = getLimaHours(parseApiDate(c.fechaHora));
                    return ch === hour;
                  });
                  return (
                    <div key={`${key}-${time}`} className="min-h-[50px] border-r border-gray-100 p-0.5">
                      {slotCitas.map((cita) => {
                        const start = parseApiDate(cita.fechaHora);
                        const h = String(getLimaHours(start)).padStart(2, '0');
                        const m = String(getLimaMinutes(start)).padStart(2, '0');
                        return (
                          <button
                            key={cita.id}
                            onClick={() => onNavigateToPatient(cita.pacienteId)}
                            className={`mb-0.5 w-full rounded border p-1 text-left text-xs transition-shadow hover:shadow-md ${statusBadge[cita.estado] || 'bg-gray-100'}`}
                          >
                            <div className="flex items-center gap-1 font-medium">
                              <Clock className="h-3 w-3" />
                              {h}:{m}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 truncate">
                              <User className="h-3 w-3 shrink-0" />
                              <span className="truncate">{cita.pacienteNombre ? `${cita.pacienteNombre} ${cita.pacienteApellido || ''}`.trim() : 'Paciente'}</span>
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
