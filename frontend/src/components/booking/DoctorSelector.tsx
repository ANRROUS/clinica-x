'use client';

import type { DisponibilidadDoctorDTO } from '@/lib/api/types';
import { Stethoscope } from 'lucide-react';
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
      <div className="grid gap-3 sm:grid-cols-2">
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
    <div className="grid gap-3 sm:grid-cols-2">
      {doctors.map((doc) => (
        <button
          key={doc.doctorId}
          onClick={() => onSelect(doc)}
          className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
            selectedId === doc.doctorId
              ? 'border-brand-500 bg-brand-50'
              : 'border-gray-200 hover:border-brand-300'
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{doc.doctorName}</p>
            <p className="text-xs text-gray-500">{doc.specialty}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
