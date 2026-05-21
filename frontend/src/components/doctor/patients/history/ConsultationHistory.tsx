'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorPatients } from '@/lib/api/doctor.api';
import ConsultationList from './ConsultationList';
import ConsultationDetail from './ConsultationDetail';
import AIChat from './AIChat';
import { nowLima, addYearsLima, formatLima } from '@clinica-x/date-utils';

interface ConsultationHistoryProps {
  patientId: string;
}

export default function ConsultationHistory({ patientId }: ConsultationHistoryProps) {
  const { isAuthenticated } = useDoctorAuthStore();
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);

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

  const patients = patientsData?.data || [];
  const patientConsultations = patients.filter((c) => c.pacienteId === patientId);
  const selectedConsultation = patientConsultations.find((c) => c.id === selectedConsultationId) || null;

  return (
    <div className="flex h-full gap-6">
      <div className="w-72 shrink-0">
        <ConsultationList
          consultations={patientConsultations}
          selectedId={selectedConsultationId}
          onSelect={(id) => setSelectedConsultationId(id)}
          isLoading={isLoading}
        />
      </div>

      <div className="flex-1">
        {selectedConsultation ? (
          <ConsultationDetail
            consultation={selectedConsultation}
            onBack={() => setSelectedConsultationId(null)}
          />
        ) : (
          <AIChat patientId={patientId} />
        )}
      </div>
    </div>
  );
}
