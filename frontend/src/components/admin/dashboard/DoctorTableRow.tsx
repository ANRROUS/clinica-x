'use client';

import { useState, useEffect } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleDoctorStatus } from '@/lib/api/admin.api';
import { getErrorMessage } from '@/lib/api/error-utils';
import type { MedicoDTO } from '@/lib/api/types';

const diaSemanaLabels: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miercoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

interface DoctorTableRowProps {
  readonly doctor: MedicoDTO;
  readonly onEdit: (id: string) => void;
}

export default function DoctorTableRow({ doctor, onEdit }: DoctorTableRowProps) {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const statusMutation = useMutation({
    mutationFn: (activo: boolean) => toggleDoctorStatus(doctor.id, activo),
    onMutate: async (activo) => {
      await queryClient.cancelQueries({ queryKey: ['admin-dashboard'] });
      const previous = queryClient.getQueryData(['admin-dashboard']);
      queryClient.setQueryData(['admin-dashboard'], (old: any) => {
        if (!old?.data?.doctors) return old;
        return {
          ...old,
          data: {
            ...old.data,
            doctors: old.data.doctors.map((d: MedicoDTO) =>
              d.id === doctor.id ? { ...d, activo } : d
            ),
          },
        };
      });
      return { previous };
    },
    onSuccess: () => {
      setShowConfirm(false);
      toast.success(doctor.activo ? 'Médico desactivado correctamente' : 'Médico activado correctamente');
    },
    onError: (err, _activo, context) => {
      setShowConfirm(false);
      if (context?.previous) {
        queryClient.setQueryData(['admin-dashboard'], context.previous);
      }
      toast.error(getErrorMessage(err));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  const uniqueDays = doctor.schedules
    ? [...new Set(doctor.schedules.map((s) => s.diaSemana))].sort((a, b) => a - b).map((d) => diaSemanaLabels[d]).join(', ')
    : '';

  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showConfirm]);

  const confirmAction = () => {
    statusMutation.mutate(!doctor.activo);
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
          {doctor.nombre} {doctor.apellido}
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
          {doctor.specialty}
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
          {uniqueDays || 'Sin horarios'}
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
          {doctor.shift === 'MANANA' ? 'Mañana' : 'Tarde'}
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
          {doctor.activo ? 'Activo' : 'Inactivo'}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onEdit(doctor.id)}
              className="text-gray-800"
              title="Editar"
              aria-label="Editar médico"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={statusMutation.isPending}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
              style={{ backgroundColor: doctor.activo ? '#008585' : '#D1D5DB' }}
              title={doctor.activo ? 'Desactivar' : 'Activar'}
              aria-label={doctor.activo ? 'Desactivar médico' : 'Activar médico'}
            >
              <span
                className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                style={{ transform: doctor.activo ? 'translateX(18px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
        </td>
      </tr>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            {statusMutation.isPending && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-[#008585]" />
                <p className="mt-2 text-sm font-semibold text-gray-700">Procesando cambio...</p>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900">Confirmar cambio de estado</h3>
            <p className="mt-2 text-sm text-gray-600">
              {doctor.activo
                ? 'Al desactivar al médico, los pacientes no podrán reservar citas con él y el doctor no podrá ingresar a su vista.'
                : 'Al activar al médico, será visible para los pacientes y el doctor tendrá acceso a su vista.'}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={statusMutation.isPending}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmAction}
                disabled={statusMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: '#008585' }}
              >
                {statusMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {statusMutation.isPending ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
