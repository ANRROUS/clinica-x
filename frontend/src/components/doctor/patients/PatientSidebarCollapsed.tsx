'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

interface PatientSidebarCollapsedProps {
  patients: ConsultaMedicoDTO[];
  activeConsultation: ConsultaMedicoDTO | null;
}

export default function PatientSidebarCollapsed({
  patients,
  activeConsultation,
}: PatientSidebarCollapsedProps) {
  const router = useRouter();

  const uniquePatients = new Map<string, ConsultaMedicoDTO>();
  if (activeConsultation) {
    uniquePatients.set(activeConsultation.pacienteId, activeConsultation);
  }
  patients.forEach((c) => {
    if (!uniquePatients.has(c.pacienteId)) {
      uniquePatients.set(c.pacienteId, c);
    }
  });

  return (
    <aside className="flex h-full w-14 flex-col items-center bg-brand-500 py-4">
      <button
        onClick={() => {
          router.push('/doctor/pacientes');
        }}
        className="mb-4 rounded-lg p-2 text-white hover:bg-brand-600"
        title="Buscar pacientes"
      >
        <Search className="h-5 w-5" />
      </button>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {Array.from(uniquePatients.values())
          .slice(0, 15)
          .map((p) => {
            const initial = (p.pacienteNombre?.[0] || '?').toUpperCase();
            return (
              <button
                key={p.pacienteId}
                onClick={() => router.push(`/doctor/pacientes/${p.pacienteId}`)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-500 hover:bg-gray-100"
                title={`${p.pacienteNombre || ''} ${p.pacienteApellido || ''}`}
              >
                {initial}
              </button>
            );
          })}
      </div>
    </aside>
  );
}
