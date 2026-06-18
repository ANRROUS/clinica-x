'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Calendar, X } from 'lucide-react';

function ToggleSwitch({
  value,
  onChange,
  leftLabel,
  rightLabel,
}: {
  value: 'activas' | 'pasadas';
  onChange: (v: 'activas' | 'pasadas') => void;
  leftLabel: string;
  rightLabel: string;
}) {
  const isRight = value === 'pasadas';
  return (
    <button
      onClick={() => onChange(isRight ? 'activas' : 'pasadas')}
      className="relative inline-flex h-9 w-44 items-center rounded-full border-2 border-[#008585] bg-[#008585] px-1 transition-colors"
      aria-label={isRight ? rightLabel : leftLabel}
    >
      <span
        className={`absolute left-1 top-1 inline-block h-6 w-20 rounded-full bg-white text-xs font-semibold leading-6 text-[#008585] shadow transition-transform duration-300 ${
          isRight ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
        }`}
      />
      <span
        className={`z-10 w-1/2 text-center text-xs font-semibold transition-colors duration-300 ${
          isRight ? 'text-white' : 'text-[#008585]'
        }`}
      >
        {leftLabel}
      </span>
      <span
        className={`z-10 w-1/2 text-center text-xs font-semibold transition-colors duration-300 ${
          isRight ? 'text-[#008585]' : 'text-white'
        }`}
      >
        {rightLabel}
      </span>
    </button>
  );
}
import {
  getPatientAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getAvailabilityByDoctor,
} from '@/lib/api/appointments.api';
import { getErrorMessage } from '@/lib/api/error-utils';
import type { CitaDTO, SlotDTO } from '@/lib/api/types';
import { AppointmentCardSkeleton } from '@/components/shared/Skeleton';
import {
  parseLimaDate,
  nowLima,
  buildLimaDate,
  toISOLima,
  getLimaDayOfWeek,
  getLimaDay,
  getLimaMonth,
  getLimaYear,
  formatDateExtended,
  formatLima,
  todayLimaString,
  diffInMsLima,
} from '@clinica-x/date-utils';

function canModifyAppointment(fechaHora: string): boolean {
  const appointmentTime = parseLimaDate(fechaHora);
  return diffInMsLima(appointmentTime, nowLima()) > 60 * 60 * 1000;
}

function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  appointment,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  appointment: CitaDTO | null;
}) {
  if (!isOpen || !appointment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Cancelar cita</h3>

        <div className="mt-3 rounded-lg bg-[#008585]/10 p-3 text-sm text-gray-700">
          <p><span className="font-semibold">Especialidad:</span> {appointment.specialty || '—'}</p>
          <p><span className="font-semibold">Médico:</span> {getDoctorDisplayName(appointment.doctorName)}</p>
          <p>
            <span className="font-semibold">Fecha:</span>{' '}
            {formatDateExtended(appointment.fechaHora)} a las{' '}
            {formatLima(appointment.fechaHora, 'HH:mm')}
          </p>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          ¿Seguro que quieres cancelar esta cita?
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Cancelando...' : 'Sí, cancelar'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            No, volver
          </button>
        </div>
      </div>
    </div>
  );
}

function RescheduleModal({
  isOpen,
  onClose,
  appointment,
}: {
  isOpen: boolean;
  onClose: () => void;
  appointment: CitaDTO | null;
}) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<SlotDTO | null>(null);

  const today = todayLimaString();

  const { data: slotsData, isLoading: loadingSlots } = useQuery({
    queryKey: ['reschedule-slots', appointment?.medicoId, selectedDate],
    queryFn: () => getAvailabilityByDoctor(appointment!.medicoId, selectedDate),
    enabled: !!appointment && !!selectedDate,
  });

  const slots: SlotDTO[] = (slotsData?.data ?? []).filter((s) => s.disponible);

  const rescheduleMutation = useMutation({
    mutationFn: (fechaHora: string) =>
      rescheduleAppointment(appointment!.id, fechaHora),
    onSuccess: () => {
      toast.success('Cita reprogramada correctamente');
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      onClose();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot || !appointment) return;
    const [h, m] = selectedSlot.horaInicio.split(':').map(Number);
    const d = buildLimaDate(selectedDate, `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
    const fechaHora = toISOLima(d);

    if (diffInMsLima(parseLimaDate(fechaHora), nowLima()) <= 60 * 60 * 1000) {
      toast.error('Debes reprogramar con al menos 1 hora de anticipación.');
      return;
    }

    rescheduleMutation.mutate(fechaHora);
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Reprogramar cita</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-[#008585]/10 p-3 text-sm text-gray-700">
          <p><span className="font-semibold">Especialidad:</span> {appointment.specialty || '—'}</p>
          <p><span className="font-semibold">Médico:</span> {appointment.doctorName || '—'}</p>
          <p>
            <span className="font-semibold">Fecha actual:</span>{' '}
            {formatDateExtended(appointment.fechaHora)} a las{' '}
            {formatLima(appointment.fechaHora, 'HH:mm')}
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Nueva fecha</label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#008585] focus:outline-none focus:ring-1 focus:ring-[#008585]"
          />
        </div>

        {selectedDate && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Nuevo horario</label>
            {loadingSlots ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-[#008585]" />
              </div>
            ) : slots.length === 0 ? (
              <p className="py-2 text-sm text-gray-500">No hay horarios disponibles para esta fecha.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const isSelected =
                    selectedSlot?.horaInicio === slot.horaInicio &&
                    selectedSlot?.horaFin === slot.horaFin;
                  return (
                    <button
                      key={`${slot.horaInicio}-${slot.horaFin}`}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        isSelected
                          ? 'border-[#008585] bg-[#008585] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-[#008585] hover:bg-[#008585]/5'
                      }`}
                    >
                      {slot.horaInicio} - {slot.horaFin}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot || rescheduleMutation.isPending}
            className="flex-1 rounded-lg bg-[#008585] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007070] disabled:opacity-50"
          >
            {rescheduleMutation.isPending ? 'Reprogramando...' : 'Confirmar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function getDoctorDisplayName(doctorName?: string): string {
  if (!doctorName) return 'Médico';
  if (doctorName.toLowerCase().startsWith('dr.')) return doctorName;
  return `Dr. ${doctorName}`;
}

export default function AppointmentsTab() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'activas' | 'pasadas'>('activas');
  const [cancelTarget, setCancelTarget] = useState<CitaDTO | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<CitaDTO | null>(null);

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: getPatientAppointments,
  });

  const appointments: CitaDTO[] = appointmentsData?.data ?? [];

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast.success('Cita cancelada correctamente');
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      setCancelTarget(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const isPast = (a: CitaDTO) =>
    a.estado === 'COMPLETADA' ||
    a.estado === 'CANCELADA' ||
    diffInMsLima(parseLimaDate(a.fechaHora), nowLima()) <= 0;

  const activeAppointments = appointments.filter(
    (a) => (a.estado === 'CONFIRMADA' || a.estado === 'EN_ATENCION') && !isPast(a),
  );

  const pastAppointments = appointments.filter(isPast);

  const displayedAppointments = filter === 'activas' ? activeAppointments : pastAppointments;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <AppointmentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="px-2">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Reservas</h3>
          <p className="text-sm text-gray-600">
            {filter === 'activas'
              ? 'Aquí podrás ver todas tus reservas que se encuentran activas'
              : 'Aquí podrás ver tu historial de reservas pasadas'}
          </p>
        </div>
        <ToggleSwitch
          value={filter}
          onChange={setFilter}
          leftLabel="Activas"
          rightLabel="Pasadas"
        />
      </div>

      {filter === 'activas' && activeAppointments.length === 0 && (
        <div className="py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No tienes reservas activas.</p>
          <p className="mt-1 text-sm text-gray-400">¡Agenda tu primera cita!</p>
        </div>
      )}

      {filter === 'pasadas' && pastAppointments.length === 0 && (
        <div className="py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No tienes reservas pasadas.</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {filter === 'activas' &&
          activeAppointments.map((appt) => {
            const canModify = canModifyAppointment(appt.fechaHora);
            return (
              <div
                key={appt.id}
                className="rounded-xl border-2 border-[#008585] bg-white p-6"
              >
                <p className="text-lg font-bold text-gray-900">{appt.specialty || 'Especialidad'}</p>
                <p className="mt-1 text-sm text-gray-700">{getDoctorDisplayName(appt.doctorName)}</p>
                <p className="mt-3 text-sm text-gray-600">
                  Fecha: {formatDateExtended(appt.fechaHora)}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Hora: {formatLima(appt.fechaHora, 'HH:mm')}
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setRescheduleTarget(appt)}
                    disabled={!canModify}
                    className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                      canModify
                        ? 'bg-[#008585] text-white hover:bg-[#007070]'
                        : 'cursor-not-allowed bg-gray-300 text-white'
                    }`}
                  >
                    Reprogramar
                  </button>
                  <button
                    onClick={() => setCancelTarget(appt)}
                    disabled={!canModify}
                    className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                      canModify
                        ? 'bg-[#888888] text-white hover:bg-[#777777]'
                        : 'cursor-not-allowed bg-gray-300 text-white'
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
                {!canModify && (
                  <p className="mt-3 text-center text-xs text-yellow-600">
                    No se puede modificar (menos de 1 hora antes)
                  </p>
                )}
              </div>
            );
          })}

        {filter === 'pasadas' &&
          pastAppointments.map((appt) => (
            <div
              key={appt.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <p className="text-lg font-bold text-gray-900">{appt.specialty || 'Especialidad'}</p>
              <p className="mt-1 text-sm text-gray-700">{getDoctorDisplayName(appt.doctorName)}</p>
              <p className="mt-3 text-sm text-gray-600">
                Fecha: {formatDateExtended(appt.fechaHora)}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Hora: {formatLima(appt.fechaHora, 'HH:mm')}
              </p>
            </div>
          ))}
      </div>

      <CancelModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
        loading={cancelMutation.isPending}
        appointment={cancelTarget}
      />

      <RescheduleModal
        isOpen={!!rescheduleTarget}
        onClose={() => {
          setRescheduleTarget(null);
        }}
        appointment={rescheduleTarget}
      />
    </div>
  );
}
