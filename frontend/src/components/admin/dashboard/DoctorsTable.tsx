'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAdminSpecialties } from '@/lib/api/admin.api';
import DoctorFilterDropdown from './DoctorFilterDropdown';
import DoctorTableRow from './DoctorTableRow';
import type { MedicoDTO, EspecialidadDTO } from '@/lib/api/types';
import { useState } from 'react';

interface DoctorsTableProps {
  doctors: MedicoDTO[];
  loading: boolean;
}

export default function DoctorsTable({ doctors, loading }: DoctorsTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const { data: specialtiesData } = useQuery({
    queryKey: ['admin-specialties'],
    queryFn: getAdminSpecialties,
  });
  const specialties: EspecialidadDTO[] = (specialtiesData?.data || []).filter((s) => s.activo);

  const filtered = useMemo(() => {
    let result = doctors;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.nombre.toLowerCase().includes(q) ||
          d.apellido.toLowerCase().includes(q) ||
          d.username.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q)
      );
    }

    if (filter === 'active') {
      result = result.filter((d) => d.activo);
    } else if (filter === 'inactive') {
      result = result.filter((d) => !d.activo);
    } else if (filter && filter !== 'all') {
      result = result.filter((d) => d.specialty === filter);
    }

    return result;
  }, [doctors, search, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Médicos</h2>
          <p className="text-sm text-gray-500">
            Gestiona los datos de tus médicos, sus horarios y más
          </p>
        </div>
        <div className="flex flex-1 items-center gap-3 sm:max-w-md sm:justify-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar médico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <DoctorFilterDropdown value={filter} onChange={setFilter} specialties={specialties} />
          <Link
            href="/admin/doctors/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Agregar +
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-600">Nombre</th>
              <th className="px-4 py-3 font-medium text-gray-600">Especialidad</th>
              <th className="px-4 py-3 font-medium text-gray-600">Horario</th>
              <th className="px-4 py-3 font-medium text-gray-600">Turno</th>
              <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
              <th className="px-4 py-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {doctors.length === 0
                    ? 'Aún no has registrado médicos. Haz clic en "Agregar +" para comenzar.'
                    : 'No hay médicos que coincidan con el filtro seleccionado.'}
                </td>
              </tr>
            ) : (
              filtered.map((doctor) => (
                <DoctorTableRow key={doctor.id} doctor={doctor} />
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