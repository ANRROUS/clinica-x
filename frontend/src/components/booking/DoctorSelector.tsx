'use client';

import Image from 'next/image';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { DisponibilidadDoctorDTO } from '@/lib/api/types';
import { DoctorCardSkeleton } from '@/components/shared/Skeleton';

interface Props {
  doctors: DisponibilidadDoctorDTO[];
  selectedId: string | null;
  onSelect: (doctor: DisponibilidadDoctorDTO) => void;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export default function DoctorSelector({
  doctors,
  selectedId,
  onSelect,
  loading,
  error,
  onRetry,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-8 text-center">
        <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
        <p className="text-sm font-medium text-red-700">
          No se pudieron cargar los médicos.
        </p>
        <p className="mb-3 text-xs text-red-600">
          Verifica tu conexión o inténtalo de nuevo.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-[#003F86] px-4 py-2 text-sm font-medium text-white hover:bg-[#00306b] transition"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 py-8 text-center">
        <AlertCircle className="mb-2 h-8 w-8 text-amber-500" />
        <p className="text-sm font-medium text-amber-800">
          No hay médicos disponibles para esta especialidad.
        </p>
        <p className="text-xs text-amber-700">
          Es posible que no haya horarios configurados o todos los turnos estén ocupados.
        </p>
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
