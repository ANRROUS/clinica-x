'use client';

import type { EspecialidadDTO } from '@/lib/api/types';

interface DoctorFilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  specialties: EspecialidadDTO[];
}

export default function DoctorFilterDropdown({ value, onChange, specialties }: DoctorFilterDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
    >
      <option value="">Filtrar por...</option>
      <option value="all">Todos</option>
      <option value="active">Activos</option>
      <option value="inactive">Inactivos</option>
      <optgroup label="Especialidad">
        {specialties.map((s) => (
          <option key={s.id} value={s.nombre}>
            {s.nombre}
          </option>
        ))}
      </optgroup>
    </select>
  );
}