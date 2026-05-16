'use client';

import type { SlotDTO } from '@/lib/api/types';
import { SlotSkeleton } from '@/components/shared/Skeleton';

interface Props {
  slots: SlotDTO[];
  selectedSlot: SlotDTO | null;
  onSelect: (slot: SlotDTO) => void;
  loading?: boolean;
}

const MAX_VISIBLE_COLUMNS = 4;

export default function SlotSelector({ slots, selectedSlot, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SlotSkeleton key={i} />
        ))}
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.disponible);

  if (availableSlots.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500">
        No hay horarios disponibles para este día.
      </p>
    );
  }

  const totalSlots = availableSlots.length;
  const needsScroll = totalSlots > MAX_VISIBLE_COLUMNS * 2;

  return (
    <div
      className={`flex flex-wrap gap-2 ${
        needsScroll ? 'max-h-[4.5rem] overflow-y-auto' : ''
      }`}
    >
      {availableSlots.map((slot) => {
        const isSelected =
          selectedSlot?.horaInicio === slot.horaInicio &&
          selectedSlot?.horaFin === slot.horaFin;
        return (
          <button
            key={`${slot.horaInicio}-${slot.horaFin}`}
            onClick={() => onSelect(slot)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              isSelected
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-300 text-gray-700 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            {slot.horaInicio} - {slot.horaFin}
          </button>
        );
      })}
    </div>
  );
}
