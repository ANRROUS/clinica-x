'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CalendarX2 } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorCalendar, getDoctorSlotDuration } from '@/lib/api/doctor.api';
import PatientSidebar from '@/components/doctor/patients/PatientSidebar';
import { nowLima, addDaysLima, formatLima } from '@clinica-x/date-utils';

export default function DoctorPacientesPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const [dateRange, setDateRange] = useState(() => {
    const desde = nowLima();
    const hasta = addDaysLima(desde, 30);
    return {
      desde: formatLima(desde, 'yyyy-MM-dd'),
      hasta: formatLima(hasta, 'yyyy-MM-dd'),
    };
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: citasData, isLoading: isLoadingCitas } = useQuery({
    queryKey: ['doctor-calendar', dateRange],
    queryFn: () => getDoctorCalendar(dateRange),
    enabled: isAuthenticated,
  });

  const { data: slotDurationData, isLoading: isLoadingSlot } = useQuery({
    queryKey: ['doctorSlotDuration'],
    queryFn: async () => {
      const res = await getDoctorSlotDuration();
      return res.success ? res.data?.duracionSlot : 30;
    },
    staleTime: Infinity,
    enabled: isAuthenticated,
  });
  const slotDuration = slotDurationData ?? 30;

  const citas = citasData?.data || [];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="flex h-full" />;
  }

  return (
    <div className="flex h-full w-full">
      <PatientSidebar
        citas={citas}
        slotDuration={slotDuration}
        onSelectPatient={(id) => router.push(`/doctor/pacientes/${id}`)}
        isLoading={isLoadingCitas || isLoadingSlot}
      />

      <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-brand-50 p-4 text-brand-500">
            <CalendarX2 className="h-12 w-12" style={{ color: '#008585' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pacientes</h2>
          <p className="text-gray-500 max-w-sm">
            Selecciona un paciente del menú lateral para ver su historial o gestionar su consulta.
          </p>
        </div>
      </div>
    </div>
  );
}
