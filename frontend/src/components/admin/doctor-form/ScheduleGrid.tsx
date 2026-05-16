'use client';

import { useMemo } from 'react';

const DAYS = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'M' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
];

function generateSlots(shift: 'MANANA' | 'TARDE'): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = [];
  const startHour = shift === 'MANANA' ? 8 : 14;
  const endHour = shift === 'MANANA' ? 13 : 19;

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

export default function ScheduleGrid({ schedules, onChange, shift, error }: ScheduleGridProps) {
  const slots = useMemo(() => generateSlots(shift), [shift]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Horario de atención <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-gray-500">
          Haz clic en las celdas para marcar disponibilidad
        </span>
      </div>

      {schedules.length === 0 && (
        <p className="text-sm text-gray-400">
          Selecciona al menos un bloque de horario.
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-20 border border-gray-200 bg-teal-50 px-2 py-1.5 text-xs font-semibold text-teal-700">
                Hora
              </th>
              {DAYS.map((d) => (
                <th
                  key={d.value}
                  className="w-20 border border-gray-200 bg-teal-50 px-2 py-1.5 text-xs font-semibold text-teal-700"
                >
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map(({ startTime, endTime }) => (
              <tr key={startTime}>
                <td className="border border-gray-200 bg-teal-50 px-2 py-1 text-center text-xs font-medium text-teal-700 whitespace-nowrap">
                  {startTime} - {endTime}
                </td>
                {DAYS.map((d) => {
                  const selected = isCellSelected(schedules, d.value, startTime);
                  return (
                    <td key={`${d.value}-${startTime}`} className="border border-gray-200 p-0">
                      <button
                        type="button"
                        onClick={() => onChange(toggleCell(schedules, d.value, startTime, endTime))}
                        className={`h-full w-full px-2 py-2 text-xs transition-colors ${
                          selected
                            ? 'bg-teal-500 text-white font-medium'
                            : 'bg-white text-gray-300 hover:bg-teal-100'
                        }`}
                      >
                        {selected ? '✓' : ''}
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