'use client';

import { useQuery } from '@tanstack/react-query';
import MetricCards from '@/components/admin/dashboard/MetricCards';
import DoctorsTable from '@/components/admin/dashboard/DoctorsTable';
import { getAdminDashboard } from '@/lib/api/admin.api';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

export default function AdminDashboardPage() {
  const { isAuthenticated } = useAdminAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
    enabled: isAuthenticated,
  });

  const doctors = data?.data?.doctors || [];
  const metrics = data?.data?.metrics || {
    totalDoctors: 0,
    activeDoctors: 0,
    inactiveDoctors: 0,
    totalSpecialties: 0,
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error al cargar los datos. Verifica que los servicios estén funcionando.
        </div>
      )}

      <MetricCards metrics={metrics} />

      <DoctorsTable doctors={doctors} loading={isLoading} />
    </div>
  );
}