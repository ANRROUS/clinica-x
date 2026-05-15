'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { EspecialidadDTO } from '@/lib/api/types';
import { useBookingStore } from '@/store/useBookingStore';

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
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Ej. Medicina General"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">
            No se encontraron especialidades
          </p>
        )}
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id, s.nombre)}
            className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
              selectedId === s.id
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-brand-50'
            }`}
          >
            {s.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}