'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';
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
  doctor: MedicoDTO;
}

export default function DoctorTableRow({ doctor }: DoctorTableRowProps) {
  const queryClient = useQueryClient();

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
      toast.success(doctor.activo ? 'Médico desactivado correctamente' : 'Médico activado correctamente');
    },
    onError: (err, _activo, context) => {
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
    ? [...new Set(doctor.schedules.map((s) => s.diaSemana))].sort().map((d) => diaSemanaLabels[d]).join(', ')
    : '';

  return (
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
          <Link
            href={`/admin/doctors/${doctor.id}/edit`}
            className="text-gray-800"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => statusMutation.mutate(!doctor.activo)}
            disabled={statusMutation.isPending}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
            style={{ backgroundColor: doctor.activo ? '#008585' : '#D1D5DB' }}
            title={doctor.activo ? 'Desactivar' : 'Activar'}
          >
            <span
              className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
              style={{ transform: doctor.activo ? 'translateX(18px)' : 'translateX(2px)' }}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}