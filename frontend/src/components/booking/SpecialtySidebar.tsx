'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { EspecialidadDTO } from '@/lib/api/types';

interface Props {
  specialties: EspecialidadDTO[];
  selectedId: string | null;
  onSelect: (id: string, name: string) => void;
}

export default function SpecialtySidebar({ specialties, selectedId, onSelect }: Props) {
  const [search, setSearch] = useState('');

  const filtered = specialties.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-full w-full flex-col">
      <h3 className="mb-4 text-base font-bold text-gray-900">Especialidad:</h3>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Ej. Medicina General"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-0 border-b border-gray-300 bg-transparent py-2 pl-1 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#008585] focus:ring-0"
        />
        <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">
            No se encontraron especialidades
          </p>
        )}
        {filtered.map((s) => {
          const isSelected = selectedId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id, s.nombre)}
              className={`w-full rounded-md px-4 py-3 text-left text-sm font-medium transition ${
                isSelected
                  ? 'bg-[#008585] text-white'
                  : 'border-l-4 border-[#008585] bg-[#E8F4F4] text-gray-700 hover:bg-[#d0eaea]'
              }`}
            >
              {s.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
