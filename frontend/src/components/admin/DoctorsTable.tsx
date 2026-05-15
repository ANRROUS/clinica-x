'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ToggleLeft, ToggleRight, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleDoctorStatus } from '@/lib/api/admin.api';
import type { MedicoDTO } from '@/lib/api/types';

interface DoctorsTableProps {
  doctors: MedicoDTO[];
  loading: boolean;
}

const diaSemanaLabels: Record<number, string> = {
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb',
  7: 'Dom',
};

export default function DoctorsTable({ doctors, loading }: DoctorsTableProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      toggleDoctorStatus(id, activo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Estado actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const filtered = doctors.filter((d) => {
    const matchSearch =
      search === '' ||
      d.nombre.toLowerCase().includes(search.toLowerCase()) ||
      d.apellido.toLowerCase().includes(search.toLowerCase()) ||
      d.username.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && d.activo) ||
      (filterStatus === 'inactive' && !d.activo);
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, username o especialidad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <Link
          href="/admin/medicos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Médico
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-600">Nombre</th>
              <th className="px-4 py-3 font-medium text-gray-600">Username</th>
              <th className="px-4 py-3 font-medium text-gray-600">Especialidad</th>
              <th className="px-4 py-3 font-medium text-gray-600">Turno</th>
              <th className="px-4 py-3 font-medium text-gray-600">Horarios</th>
              <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
              <th className="px-4 py-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron médicos.
                </td>
              </tr>
            ) : (
              filtered.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {doctor.nombre} {doctor.apellido}
                      </p>
                      <p className="text-xs text-gray-500">{doctor.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{doctor.username}</td>
                  <td className="px-4 py-3 text-gray-700">{doctor.specialty}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        statusMutation.mutate({ id: doctor.id, activo: !doctor.activo })
                      }
                      disabled={statusMutation.isPending}
                      className="flex items-center gap-1.5"
                      title={doctor.activo ? 'Desactivar' : 'Activar'}
                    >
                      {doctor.activo ? (
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/medicos/${doctor.id}/editar`}
                        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-emerald-600"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      {!doctor.activo && (
                        <button
                          onClick={() =>
                            statusMutation.mutate({ id: doctor.id, activo: true })
                          }
                          disabled={statusMutation.isPending}
                          className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Mostrando {filtered.length} de {doctors.length} médicos
      </p>
    </div>
  );
}