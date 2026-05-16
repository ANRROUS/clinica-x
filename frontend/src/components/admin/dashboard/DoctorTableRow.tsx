'use client';

import Link from 'next/link';
import { Pencil, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleDoctorStatus } from '@/lib/api/admin.api';
import type { MedicoDTO } from '@/lib/api/types';

const diaSemanaLabels: Record<number, string> = {
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb',
  7: 'Dom',
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
    onError: (_err, _activo, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['admin-dashboard'], context.previous);
      }
      toast.error('No se pudo cambiar el estado del médico.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  return (
    <tr className="hover:bg-gray-50">
      <td className="whitespace-nowrap px-4 py-3">
        <p className="max-w-[180px] truncate font-medium text-gray-900">
          {doctor.nombre} {doctor.apellido}
        </p>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
        {doctor.specialty}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {doctor.schedules && doctor.schedules.length > 0 ? (
            doctor.schedules.map((s) => (
              <span
                key={s.id}
                className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
              >
                {diaSemanaLabels[s.diaSemana]} {s.horaInicio}-{s.horaFin}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">Sin horarios</span>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            doctor.shift === 'MANANA'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {doctor.shift === 'MANANA' ? 'Mañana' : 'Tarde'}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <button
          onClick={() => statusMutation.mutate(!doctor.activo)}
          disabled={statusMutation.isPending}
          className="flex items-center gap-1.5"
          title={doctor.activo ? 'Desactivar' : 'Activar'}
        >
          {statusMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : doctor.activo ? (
            <>
              <ToggleRight className="h-5 w-5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Activo</span>
            </>
          ) : (
            <>
              <ToggleLeft className="h-5 w-5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Inactivo</span>
            </>
          )}
        </button>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Link
          href={`/admin/doctors/${doctor.id}/edit`}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-teal-600"
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}