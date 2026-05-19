'use client';

import Image from 'next/image';
import type { DisponibilidadDoctorDTO } from '@/lib/api/types';
import { DoctorCardSkeleton } from '@/components/shared/Skeleton';

interface Props {
  doctors: DisponibilidadDoctorDTO[];
  selectedId: string | null;
  onSelect: (doctor: DisponibilidadDoctorDTO) => void;
  loading?: boolean;
}

export default function DoctorSelector({ doctors, selectedId, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No hay médicos disponibles para esta especialidad.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {doctors.map((doc) => {
        const isSelected = selectedId === doc.doctorId;
        return (
          <button
            key={doc.doctorId}
            onClick={() => onSelect(doc)}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
              isSelected
                ? 'border-[#008585] bg-[#008585] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#008585]/50'
            }`}
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/assets/image-frontend.png"
                alt={doc.doctorName}
                fill
                className="object-cover"
              />
            </div>
            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
              {doc.doctorName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
