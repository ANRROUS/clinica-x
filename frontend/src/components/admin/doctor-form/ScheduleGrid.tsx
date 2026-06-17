'use client';

import { useMemo } from 'react';
import {
  nowLima,
  addDaysLima,
  getLimaDayOfWeek,
  getLimaDay,
  formatLima,
} from '@clinica-x/date-utils';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAYS = [
  { value: 1, short: 'L', name: 'Lun' },
  { value: 2, short: 'M', name: 'Mar' },
  { value: 3, short: 'M', name: 'Mié' },
  { value: 4, short: 'J', name: 'Jue' },
  { value: 5, short: 'V', name: 'Vie' },
];

function generateSlots(shift: 'MANANA' | 'TARDE'): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = [];
  const startHour = shift === 'MANANA' ? 0 : 12;
  const endHour = shift === 'MANANA' ? 12 : 24;

  for (let h = startHour; h < endHour; h++) {
    const startStr = `${String(h).padStart(2, '0')}:00`;
    const endStr = `${String(h).padStart(2, '0')}:30`;
    slots.push({ startTime: startStr, endTime: endStr });

    const startStr2 = `${String(h).padStart(2, '0')}:30`;
    const endStr2 = `${String(h + 1).padStart(2, '0')}:00`;
    slots.push({ startTime: startStr2, endTime: endStr2 });
  }

  return slots;
}

export interface HorarioEntry {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

interface ScheduleGridProps {
  schedules: HorarioEntry[];
  onChange: (schedules: HorarioEntry[]) => void;
  shift: 'MANANA' | 'TARDE';
  error?: string;
}

function isCellSelected(schedules: HorarioEntry[], dayOfWeek: number, startTime: string): boolean {
  return schedules.some(
    (s) => s.diaSemana === dayOfWeek && s.horaInicio === startTime
  );
}

function toggleCell(
  schedules: HorarioEntry[],
  dayOfWeek: number,
  startTime: string,
  endTime: string
): HorarioEntry[] {
  const exists = schedules.some(
    (s) => s.diaSemana === dayOfWeek && s.horaInicio === startTime
  );

  if (exists) {
    return schedules.filter(
      (s) => !(s.diaSemana === dayOfWeek && s.horaInicio === startTime)
    );
  }

  return [...schedules, { diaSemana: dayOfWeek, horaInicio: startTime, horaFin: endTime }];
}

function getMonday(date: Date): Date {
  const day = getLimaDayOfWeek(date);
  const diff = day === 7 ? -6 : 1 - day;
  return addDaysLima(date, diff);
}

export default function ScheduleGrid({ schedules, onChange, shift, error }: ScheduleGridProps) {
  const slots = useMemo(() => generateSlots(shift), [shift]);

  const monday = useMemo(() => {
    const today = nowLima();
    const mon = getMonday(today);
    const dow = getLimaDayOfWeek(today);
    return dow >= 6 ? addDaysLima(mon, 7) : mon;
  }, []);

  const friday = useMemo(() => addDaysLima(monday, 4), [monday]);

  const weekDays = useMemo(() => {
    return DAYS.map((d, i) => {
      const date = addDaysLima(monday, i);
      return { ...d, date };
    });
  }, [monday]);

  const monthLabel = useMemo(() => {
    const month = Number(formatLima(monday, 'MM')) - 1;
    const year = Number(formatLima(monday, 'yyyy'));
    const fridayMonth = Number(formatLima(friday, 'MM')) - 1;
    const fridayYear = Number(formatLima(friday, 'yyyy'));

    if (month !== fridayMonth || year !== fridayYear) {
      const displayYear = year !== fridayYear ? `${year}/${fridayYear}` : String(year);
      return `${MONTH_NAMES[month]} - ${MONTH_NAMES[fridayMonth]} ${displayYear}`;
    }

    return `${MONTH_NAMES[month]} ${year}`;
  }, [monday, friday]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-sm font-bold text-gray-900">{monthLabel}</h4>
        <p className="text-xs text-gray-400">
          {weekDays.map((d, i) => (
            <span key={d.value}>
              {d.name} {getLimaDay(d.date)}
              {i < 4 ? ' — ' : ''}
            </span>
          ))}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                className="w-24 border border-gray-200 px-2 py-2 text-xs font-semibold text-white"
                style={{ backgroundColor: '#008585' }}
              >
                Hora
              </th>
              {weekDays.map((d) => (
                <th
                  key={d.value}
                  className="w-20 border border-gray-200 px-2 py-2 text-center text-xs font-semibold text-white"
                  style={{ backgroundColor: '#008585' }}
                >
                  <div>{d.name}</div>
                  <div className="text-white/70">{getLimaDay(d.date)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map(({ startTime, endTime }) => (
              <tr key={startTime}>
                <td
                  className="border border-gray-200 px-2 py-2 text-center text-xs font-semibold text-white whitespace-nowrap"
                  style={{ backgroundColor: '#008585' }}
                >
                  {startTime} - {endTime}
                </td>
                {DAYS.map((d) => {
                  const selected = isCellSelected(schedules, d.value, startTime);
                  return (
                    <td key={`${d.value}-${startTime}`} className="border border-gray-200 p-0">
                      <button
                        type="button"
                        onClick={() => onChange(toggleCell(schedules, d.value, startTime, endTime))}
                        className="h-full w-full px-2 py-2 text-xs transition-colors"
                        style={
                          selected
                            ? { backgroundColor: '#008585', color: '#fff', fontWeight: 600 }
                            : { backgroundColor: '#fff', color: '#D1D5DB' }
                        }
                      >
                        {selected ? '\u2713' : ''}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
