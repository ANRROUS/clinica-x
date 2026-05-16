'use client';

import { useQuery } from '@tanstack/react-query';
import { getDoctorPatients } from '@/lib/api/doctor.api';

export function useDoctorPatients(params?: { desde?: string; hasta?: string }) {
  return useQuery({
    queryKey: ['doctor-patients', params],
    queryFn: () => getDoctorPatients(params),
  });
}
