'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import DoctorCalendar from '@/components/doctor/DoctorCalendar';
import { useAuthStore } from '@/store/useAuthStore';
import { getDoctorCalendar } from '@/lib/api/doctor.api';
import type { CitaCalendarioDTO } from '@/lib/api/types';
import { nowLima, addDaysLima, formatLima } from '@clinica-x/date-utils';

export default function DoctorCalendarioPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [dateRange, setDateRange] = useState(() => {
    const desde = addDaysLima(nowLima(), -7);
    const hasta = addDaysLima(nowLima(), 30);
    return {
      desde: formatLima(desde, 'yyyy-MM-dd'),
      hasta: formatLima(hasta, 'yyyy-MM-dd'),
    };
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: citasData, isLoading } = useQuery({
    queryKey: ['doctor-calendar', dateRange],
    queryFn: () => getDoctorCalendar(dateRange),
    enabled: isAuthenticated,
  });

  const citas: CitaCalendarioDTO[] = citasData?.data || [];

  const handleNavigateToPatient = (patientId: string) => {
    router.push(`/doctor/pacientes/${patientId}`);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="flex h-full flex-col" />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Mi Calendario</h1>
        <p className="text-sm text-gray-500">Gestiona tus citas y consultas</p>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <DoctorCalendar
          citas={citas}
          onNavigateToPatient={handleNavigateToPatient}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
