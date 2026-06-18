'use client';

import { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAdminSpecialties } from '@/lib/api/admin.api';
import DoctorFilterDropdown from './DoctorFilterDropdown';
import DoctorTableRow from './DoctorTableRow';
import DoctorForm from '@/components/admin/doctor-form/DoctorForm';
import type { MedicoDTO, EspecialidadDTO } from '@/lib/api/types';

interface DoctorsTableProps {
  doctors: MedicoDTO[];
  loading: boolean;
}

export default function DoctorsTable({ doctors, loading }: DoctorsTableProps) {
  const [filter, setFilter] = useState('');
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  const { data: specialtiesData } = useQuery({
    queryKey: ['admin-specialties'],
    queryFn: getAdminSpecialties,
  });
  const specialties: EspecialidadDTO[] = (specialtiesData?.data || []).filter((s) => s.activo);

  useEffect(() => {
    if (editingDoctorId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingDoctorId]);

  const filtered = useMemo(() => {
    let result = doctors;

    if (filter === 'active') {
      result = result.filter((d) => d.activo);
    } else if (filter === 'inactive') {
      result = result.filter((d) => !d.activo);
    } else if (filter && filter !== 'all') {
      result = result.filter((d) => d.specialty === filter);
    }

    return result;
  }, [doctors, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#008585]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Médicos</h2>
          <p className="text-sm text-gray-500">
            Gestiona los datos de tus médicos, sus horarios y más
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DoctorFilterDropdown value={filter} onChange={setFilter} specialties={specialties} />
          <Link
            href="/admin/doctors/new"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: '#008585' }}
          >
            Agregar
            <Plus className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#008585' }}>Nombre</th>
              <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#008585' }}>Especialidad</th>
              <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#008585' }}>Horario</th>
              <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#008585' }}>Turno</th>
              <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#008585' }}>Estado</th>
              <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#008585' }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {doctors.length === 0
                    ? 'Aún no has registrado médicos. Haz clic en "Agregar" para comenzar.'
                    : 'No hay médicos que coincidan con el filtro seleccionado.'}
                </td>
              </tr>
            ) : (
              filtered.map((doctor) => (
                <DoctorTableRow key={doctor.id} doctor={doctor} onEdit={setEditingDoctorId} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Mostrando {filtered.length} de {doctors.length} médicos
      </p>

      {editingDoctorId &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/50 p-4">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <DoctorForm
                editId={editingDoctorId}
                onCancel={() => setEditingDoctorId(null)}
                onSaved={() => setEditingDoctorId(null)}
                isModal
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
