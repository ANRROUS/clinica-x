'use client';

import { useQuery } from '@tanstack/react-query';
import { Mail, Phone } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorPatientDetail } from '@/lib/api/doctor.api';
import { PatientHeaderSkeleton } from '@/components/shared/Skeleton';
import ConsultationTimer from './ConsultationTimer';

interface PatientHeaderProps {
  patientId: string;
  patientName: string;
  isActivePatient?: boolean;
  fechaHora?: string;
  slotDuration?: number;
  isLoading?: boolean;
}

export default function PatientHeader({ patientId, patientName, isActivePatient, fechaHora, slotDuration, isLoading = false }: PatientHeaderProps) {
  const { isAuthenticated } = useDoctorAuthStore();

  const { data } = useQuery({
    queryKey: ['doctor-patient-detail', patientId],
    queryFn: () => getDoctorPatientDetail(patientId),
    enabled: isAuthenticated && !!patientId,
  });

  if (isLoading) {
    return <PatientHeaderSkeleton />;
  }

  const patient = data?.data?.patient;
  const displayName = patient ? `${patient.nombre} ${patient.apellido}`.trim() : patientName;

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{displayName}</p>
          {patient?.dni && (
            <span className="inline-flex items-center rounded-md bg-brand-700 px-2 py-0.5 text-xs font-medium text-white">
              DNI: {patient.dni}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {isActivePatient && fechaHora && slotDuration && (
          <div className="flex-shrink-0">
            <ConsultationTimer key={fechaHora} fechaHora={fechaHora} slotDuration={slotDuration} />
          </div>
        )}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{patient?.email || '—'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{patient?.telefono || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
