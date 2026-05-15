'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DoctorCalendar from '@/components/doctor/DoctorCalendar';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorCalendar, changeAppointmentStatus } from '@/lib/api/doctor.api';
import type { CitaCalendarioDTO } from '@/lib/api/types';

export default function DoctorCalendarioPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState(() => {
    const desde = new Date();
    desde.setDate(desde.getDate() - 7);
    const hasta = new Date();
    hasta.setDate(hasta.getDate() + 30);
    return {
      desde: desde.toISOString().slice(0, 10),
      hasta: hasta.toISOString().slice(0, 10),
    };
  });

  const { data: citasData, isLoading } = useQuery({
    queryKey: ['doctor-calendar', dateRange],
    queryFn: () => getDoctorCalendar(dateRange),
    enabled: isAuthenticated,
  });

  const citas: CitaCalendarioDTO[] = citasData?.data || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: 'CONFIRMADA' | 'EN_ATENCION' | 'COMPLETADA' | 'CANCELADA' }) =>
      changeAppointmentStatus(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-calendar'] });
      toast.success('Estado actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const handleStatusChange = (id: string, estado: 'CONFIRMADA' | 'EN_ATENCION' | 'COMPLETADA' | 'CANCELADA') => {
    statusMutation.mutate({ id, estado });
  };

  const handleStartConsultation = (cita: CitaCalendarioDTO) => {
    const params = new URLSearchParams({
      pacienteId: cita.pacienteId,
      citaId: cita.id,
      pacienteNombre: `${cita.pacienteNombre || ''} ${cita.pacienteApellido || ''}`.trim(),
    });
    router.push(`/doctor/consulta?${params.toString()}`);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Mi Calendario</h1>
        <p className="text-sm text-gray-500">Gestiona tus citas y consultas</p>
      </div>
      <div className="flex-1 bg-gray-50">
        <DoctorCalendar
          citas={citas}
          onStatusChange={handleStatusChange}
          onStartConsultation={handleStartConsultation}
          loading={isLoading}
        />
      </div>
    </div>
  );
}