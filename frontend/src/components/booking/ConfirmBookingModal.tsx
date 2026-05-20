'use client';

import { X, AlertTriangle } from 'lucide-react';
import type { DisponibilidadDoctorDTO, SlotDTO } from '@/lib/api/types';
import { parseLimaDate, getLimaDay, getLimaMonth } from '@clinica-x/date-utils';

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

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatDateDisplay(dateStr: string): string {
  const d = parseLimaDate(dateStr + 'T00:00:00');
  return `${getLimaDay(d)} de ${MONTHS[getLimaMonth(d)]}`;
}

function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name[0] || '').toUpperCase();
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
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900">Confirmar Reserva</h2>
          <div className="flex items-center gap-3">
            {doctor && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {getInitials(doctor.doctorName)}
              </div>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
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

        <p className="mb-3 text-sm text-gray-600">
          Al confirmar tu reserva, ten en cuenta que solo podrás reprogramar o cancelar
          hasta un máximo de una hora antes de la cita.
        </p>

        <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
          <p className="text-xs text-yellow-800">
            Si reservas una cita que falta menos de una hora para realizarse, no podrás
            reprogramarla ni cancelarla, de acuerdo a los{' '}
            <a href="/terminos" className="underline hover:text-yellow-900">
              términos y condiciones
            </a>
            .
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
