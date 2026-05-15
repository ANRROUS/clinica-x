'use client';

import type { SlotDTO } from '@/lib/api/types';

interface Props {
  slots: SlotDTO[];
  selectedSlot: SlotDTO | null;
  onSelect: (slot: SlotDTO) => void;
}

export default function SlotSelector({ slots, selectedSlot, onSelect }: Props) {
  const availableSlots = slots.filter((s) => s.disponible);

  if (availableSlots.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500">
        No hay horarios disponibles para este día.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
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