'use client';

import { X } from 'lucide-react';
import type { DisponibilidadDoctorDTO, SlotDTO } from '@/lib/api/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  specialtyName: string;
  doctor: DisponibilidadDoctorDTO | null;
  date: string | null;
  slot: SlotDTO | null;
  bookingMode: 'manual' | 'automatic';
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return `${d.getDate()} de ${months[d.getMonth()]}`;
}

export default function ConfirmBookingModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  specialtyName,
  doctor,
  date,
  slot,
  bookingMode,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Confirmar Reserva</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-brand-50 p-4">
          <div className="space-y-1 text-sm">
            <p><span className="font-semibold">Especialidad:</span> {specialtyName}</p>
            <p><span className="font-semibold">Especialista:</span> {doctor?.doctorName || 'Por asignar'}</p>
            {date && slot && (
              <p>
                <span className="font-semibold">Fecha y turno:</span>{' '}
                {formatDateDisplay(date)} ({slot.horaInicio} - {slot.horaFin})
              </p>
            )}
            {bookingMode === 'automatic' && !date && (
              <p className="text-brand-700">
                El sistema asignará el turno más próximo disponible.
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-xs text-yellow-800">
            Al confirmar tu reserva, ten en cuenta que solo podrás reprogramar o cancelar
            hasta un máximo de una hora antes de la cita.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? 'Reservando...' : 'Aceptar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}