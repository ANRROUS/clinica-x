'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Calendar, X } from 'lucide-react';
import { getPatientAppointments, cancelAppointment } from '@/lib/api/appointments.api';
import type { CitaDTO } from '@/lib/api/types';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function formatDateExtended(iso: string): string {
  const d = new Date(iso);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} de ${d.getFullYear()}`;
}

function canModifyAppointment(fechaHora: string): boolean {
  const appointmentTime = new Date(fechaHora).getTime();
  return appointmentTime - Date.now() > 60 * 60 * 1000;
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
        <p className="mt-2 text-sm text-gray-600">
          ¿Seguro que quieres cancelar tu cita con{' '}
          <span className="font-medium">{appointment.doctorName || 'el médico'}</span> el{' '}
          <span className="font-medium">{formatDateExtended(appointment.fechaHora)}</span>?
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Cancelando...' : 'Sí, cancelar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            No, volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsTab() {
  const queryClient = useQueryClient();
  const [cancelTarget, setCancelTarget] = useState<CitaDTO | null>(null);

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
    onError: () => {
      toast.error('No se pudo cancelar la cita. Intenta de nuevo.');
    },
  });

  const activeAppointments = appointments.filter(
    (a) => a.estado === 'CONFIRMADA' || a.estado === 'EN_ATENCION',
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (activeAppointments.length === 0) {
    return (
      <div className="py-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-4 text-gray-500">No tienes reservas activas.</p>
        <p className="mt-1 text-sm text-gray-400">¡Agenda tu primera cita!</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Reservas Confirmadas</h3>
      <p className="mb-6 text-sm text-gray-500">
        Aquí podrás ver todas tus reservas que se encuentran activas.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {activeAppointments.map((appt) => {
          const canModify = canModifyAppointment(appt.fechaHora);
          return (
            <div
              key={appt.id}
              className="rounded-lg border border-gray-200 bg-white p-5"
            >
              <p className="font-bold text-gray-900">{appt.specialty || 'Especialidad'}</p>
              <p className="text-sm text-gray-600">{appt.doctorName || 'Médico'}</p>
              <p className="mt-2 text-sm text-gray-500">
                Fecha: {formatDateExtended(appt.fechaHora)}
              </p>
              <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                {appt.estado === 'CONFIRMADA' ? 'Confirmada' : 'En atención'}
              </span>

              <div className="mt-4 flex gap-2">
                <button
                  disabled
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 opacity-50 cursor-not-allowed"
                  title="Reprogramar - próximamente"
                >
                  Reprogramar
                </button>
                <button
                  onClick={() => setCancelTarget(appt)}
                  disabled={!canModify}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    canModify
                      ? 'border border-red-300 text-red-600 hover:bg-red-50'
                      : 'cursor-not-allowed border border-gray-200 text-gray-400'
                  }`}
                >
                  Cancelar
                </button>
              </div>
              {!canModify && (
                <p className="mt-2 text-xs text-yellow-600">
                  No se puede cancelar (menos de 1 hora antes)
                </p>
              )}
            </div>
          );
        })}
      </div>

      <CancelModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
        loading={cancelMutation.isPending}
        appointment={cancelTarget}
      />
    </>
  );
}