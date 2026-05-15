'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardKPI from '@/components/admin/DashboardKPI';
import DoctorsTable from '@/components/admin/DoctorsTable';
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
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen general de la clínica</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Error al cargar los datos. Verifica que los servicios estén funcionando.
          </div>
        )}

        <DashboardKPI metrics={metrics} />

        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Médicos Registrados</h2>
          <DoctorsTable doctors={doctors} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}