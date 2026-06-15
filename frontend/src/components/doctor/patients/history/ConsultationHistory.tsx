'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorPatients, getActivePatient, getDoctorSlotDuration } from '@/lib/api/doctor.api';
import ConsultationList from './ConsultationList';
import ConsultationDetail from './ConsultationDetail';
import AIChat from './AIChat';
import { nowLima, addYearsLima, formatLima } from '@clinica-x/date-utils';
import { parseApiDate } from '@/lib/date-utils';
import { Bot } from 'lucide-react';

interface ConsultationHistoryProps {
  patientId: string;
}

export default function ConsultationHistory({ patientId }: ConsultationHistoryProps) {
  const { isAuthenticated } = useDoctorAuthStore();
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');

  const hoy = nowLima();
  const dateRange = {
    desde: formatLima(addYearsLima(hoy, -2), 'yyyy-MM-dd'),
    hasta: formatLima(hoy, 'yyyy-MM-dd'),
  };

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['doctor-patients', dateRange],
    queryFn: () => getDoctorPatients(dateRange),
    enabled: isAuthenticated,
  });

  const { data: activeData } = useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled: isAuthenticated,
  });

  const { data: slotDurationData } = useQuery({
    queryKey: ['doctorSlotDuration'],
    queryFn: async () => {
      const res = await getDoctorSlotDuration();
      return res.success ? res.data?.duracionSlot : 30;
    },
    staleTime: Infinity,
    enabled: isAuthenticated,
  });
  const slotDuration = slotDurationData ?? 30;

  const patients = patientsData?.data || [];
  const patientConsultations = patients.filter((c) => c.pacienteId === patientId);
  const selectedConsultation = patientConsultations.find((c) => c.id === selectedConsultationId) || null;

  const isActivePatient = (() => {
    if (!activeData?.success || !activeData.data) return false;
    const active = activeData.data;
    if (active.pacienteId !== patientId) return false;

    const inicio = parseApiDate(active.fechaInicio);
    const now = nowLima();
    const appointmentEnd = new Date(inicio.getTime() + slotDuration * 60000);
    return now >= inicio && now <= appointmentEnd;
  })();

  const currentPatient = patientConsultations[0];
  const patientName = currentPatient
    ? `${currentPatient.pacienteNombre || ''} ${currentPatient.pacienteApellido || ''}`.trim()
    : 'Paciente';

  const completedConsultations = patientConsultations
    .filter((c) => c.estado === 'FINALIZADA')
    .sort((a, b) => parseApiDate(b.fechaInicio).getTime() - parseApiDate(a.fechaInicio).getTime());
  const lastConsultation = completedConsultations[0] || null;

  return (
    <div className="flex h-full gap-6">
      <div className="w-72 shrink-0">
        <ConsultationList
          consultations={patientConsultations}
          selectedId={selectedConsultationId}
          onSelect={(id) => setSelectedConsultationId(id)}
          isLoading={isLoading}
          filterDate={filterDate}
          onFilterDateChange={setFilterDate}
        />
      </div>

      <div className="flex-1">
        {selectedConsultation ? (
          <ConsultationDetail
            consultation={selectedConsultation}
            onBack={() => setSelectedConsultationId(null)}
          />
        ) : isActivePatient ? (
          <AIChat
            patientId={patientId}
            patientName={patientName}
            consultationId={activeData?.data?.id || undefined}
            lastConsultation={lastConsultation}
            onSelectDateFilter={(dateStr, consultationId) => {
              setFilterDate(dateStr);
              setSelectedConsultationId(consultationId);
            }}
          />
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <Bot className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-1 text-base font-bold text-gray-900">Agente X no disponible</h3>
            <p className="max-w-sm text-sm text-gray-500">
              El asistente virtual solo está disponible para interactuar durante la consulta activa de este paciente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
