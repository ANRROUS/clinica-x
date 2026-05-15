'use client';

import type { DiaDisponibilidadDTO } from '@/lib/api/types';

interface Props {
  days: DiaDisponibilidadDTO[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const dayName = DAY_NAMES[d.getDay()];
  const day = d.getDate();
  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  const month = monthNames[d.getMonth()];
  return `${dayName} ${day} ${month}`;
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
    <div className="flex flex-wrap gap-2">
      {days.map((day) => {
        const available = hasAvailableSlots(day);
        return (
          <button
            key={day.fecha}
            disabled={!available}
            onClick={() => available && onSelect(day.fecha)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedDate === day.fecha
                ? 'bg-brand-500 text-white'
                : available
                  ? 'border border-gray-300 text-gray-700 hover:border-brand-300 hover:bg-brand-50'
                  : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
            }`}
          >
            {formatDateLabel(day.fecha)}
          </button>
        );
      })}
    </div>
  );
}