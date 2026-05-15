'use client';

import { useQuery } from '@tanstack/react-query';
import DoctorsTable from '@/components/admin/DoctorsTable';
import { getAdminDoctors } from '@/lib/api/admin.api';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

export default function MedicosPage() {
  const { isAuthenticated } = useAdminAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDoctors,
    enabled: isAuthenticated,
  });

  const doctors = data?.data?.doctors || [];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Médicos</h1>
        <p className="text-sm text-gray-500">Gestiona los médicos de la clínica</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <DoctorsTable doctors={doctors} loading={isLoading} />
      </div>
    </div>
  );
}