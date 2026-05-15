'use client';

import { Users, UserCheck, UserX, Stethoscope } from 'lucide-react';
import type { MetricasDashboardDTO } from '@/lib/api/types';

interface DashboardKPIProps {
  metrics: MetricasDashboardDTO;
}

const kpiCards = [
  { key: 'totalDoctors' as const, label: 'Total Médicos', icon: Users, color: 'bg-blue-50 text-blue-700' },
  { key: 'activeDoctors' as const, label: 'Médicos Activos', icon: UserCheck, color: 'bg-emerald-50 text-emerald-700' },
  { key: 'inactiveDoctors' as const, label: 'Médicos Inactivos', icon: UserX, color: 'bg-red-50 text-red-700' },
  { key: 'totalSpecialties' as const, label: 'Especialidades', icon: Stethoscope, color: 'bg-amber-50 text-amber-700' },
];

export default function DashboardKPI({ metrics }: DashboardKPIProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiCards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics[key]}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}