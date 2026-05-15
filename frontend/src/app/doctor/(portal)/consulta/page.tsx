'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getActivePatient } from '@/lib/api/doctor.api';
import ConsultationPanel from '@/components/doctor/ConsultationPanel';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

export default function DoctorConsultaPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const citaId = searchParams.get('citaId') || undefined;
  const pacienteId = searchParams.get('pacienteId') || '';
  const pacienteNombre = searchParams.get('pacienteNombre') || undefined;

  const [activeConsultation, setActiveConsultation] = useState<ConsultaMedicoDTO | null>(null);

  const { data: activeData } = useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled: isAuthenticated && !!pacienteId,
  });

  useEffect(() => {
    if (activeData?.success && activeData.data) {
      setActiveConsultation(activeData.data);
    }
  }, [activeData]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <button
          onClick={() => router.push('/doctor/calendario')}
          className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Consulta Médica</h1>
          <p className="text-sm text-gray-500">
            {pacienteNombre || `Paciente ${pacienteId.slice(0, 8)}...`}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl">
          <ConsultationPanel
            activeConsultation={activeConsultation}
            pacienteId={pacienteId}
            citaId={citaId}
            pacienteNombre={pacienteNombre}
            onConsultationStarted={(consulta) => setActiveConsultation(consulta)}
            onConsultationFinalized={() => {
              setActiveConsultation(null);
              router.push('/doctor/calendario');
            }}
          />

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 font-semibold text-gray-900">Agente X — Asistente IA</h3>
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-400">Chat con IA próximamente disponible</p>
              <p className="mt-1 text-xs text-gray-400">
                Podrás obtener sugerencias de diagnóstico y recomendaciones interactivas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}