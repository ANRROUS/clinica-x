'use client';

import { useQuery } from '@tanstack/react-query';
import { getActivePatient } from '@/lib/api/doctor.api';

export function useActivePatient(enabled = true) {
  return useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled,
  });
}
