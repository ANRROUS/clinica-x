'use client';

import type { DiaDisponibilidadDTO } from '@/lib/api/types';
import { parseLimaDate, getLimaDayOfWeek, getLimaDay } from '@clinica-x/date-utils';

interface Props {
  days: DiaDisponibilidadDTO[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function formatDateLabel(dateStr: string): { dayName: string; dayNum: string } {
  const d = parseLimaDate(dateStr + 'T00:00:00');
  const dayName = DAY_NAMES_FULL[getLimaDayOfWeek(d) % 7];
  const dayNum = String(getLimaDay(d));
  return { dayName, dayNum };
}

function hasAvailableSlots(day: DiaDisponibilidadDTO): boolean {
  return day.slots.some((s) => s.disponible);
}

export default function DaySelector({ days, selectedDate, onSelect }: Props) {
  if (days.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500">
        No hay días disponibles para este médico.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {days.map((day) => {
        const available = hasAvailableSlots(day);
        const isSelected = selectedDate === day.fecha;
        const { dayName, dayNum } = formatDateLabel(day.fecha);
        return (
          <button
            key={day.fecha}
            disabled={!available}
            onClick={() => available && onSelect(day.fecha)}
            className={`relative flex flex-col items-center rounded-xl px-5 py-3 text-sm font-medium transition min-w-[80px] ${
              isSelected
                ? 'bg-[#008585] text-white'
                : available
                  ? 'border border-gray-300 bg-white text-gray-700 hover:border-[#008585]'
                  : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
            }`}
          >
            {isSelected && (
              <span className="absolute -top-1.5 h-3 w-3 rounded-full bg-[#008585]" />
            )}
            <span className="text-xs">{dayName}</span>
            <span className="text-lg font-bold">{dayNum}</span>
          </button>
        );
      })}
    </div>
  );
}
