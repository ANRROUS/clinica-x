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
      className="min-w-[180px] rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
      style={{ borderColor: '#008585', color: '#374151' }}
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