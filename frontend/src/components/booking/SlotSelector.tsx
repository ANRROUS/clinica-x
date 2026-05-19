'use client';

import type { SlotDTO } from '@/lib/api/types';
import { SlotSkeleton } from '@/components/shared/Skeleton';

interface Props {
  slots: SlotDTO[];
  selectedSlot: SlotDTO | null;
  onSelect: (slot: SlotDTO) => void;
  loading?: boolean;
}

export default function SlotSelector({ slots, selectedSlot, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SlotSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500">
        No hay horarios disponibles para este día.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {slots.map((slot) => {
        const isSelected =
          selectedSlot?.horaInicio === slot.horaInicio &&
          selectedSlot?.horaFin === slot.horaFin;
        return (
          <button
            key={`${slot.horaInicio}-${slot.horaFin}`}
            onClick={() => slot.disponible && onSelect(slot)}
            disabled={!slot.disponible}
            className={`rounded-lg px-3 py-2.5 text-center text-xs font-medium transition ${
              isSelected
                ? 'bg-[#008585] text-white'
                : slot.disponible
                  ? 'border border-gray-300 bg-white text-gray-700 hover:border-[#008585] hover:bg-[#008585]/5'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }`}
          >
            {slot.horaInicio} - {slot.horaFin}
          </button>
        );
      })}
    </div>
  );
}
