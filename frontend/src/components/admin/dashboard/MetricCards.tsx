'use client';

import { Users, UserCheck, UserX, Stethoscope } from 'lucide-react';
import type { MetricasDashboardDTO } from '@/lib/api/types';

interface MetricCardsProps {
  metrics: MetricasDashboardDTO;
}

const cards = [
  { key: 'totalDoctors' as const, label: 'TOTAL MÉDICOS', icon: Users, bg: 'bg-teal-600', text: 'text-white' },
  { key: 'activeDoctors' as const, label: 'ACTIVOS', icon: UserCheck, bg: 'bg-teal-500', text: 'text-teal-100' },
  { key: 'inactiveDoctors' as const, label: 'INACTIVO', icon: UserX, bg: 'bg-red-500', text: 'text-red-100' },
  { key: 'totalSpecialties' as const, label: 'ESPECIALIDADES', icon: Stethoscope, bg: 'bg-teal-700', text: 'text-white' },
];

export default function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, bg, text }) => (
        <div key={key} className={`rounded-xl p-5 ${bg}`}>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${text}`} />
            <div>
              <p className={`text-3xl font-bold ${text}`}>{metrics[key]}</p>
              <p className={`text-xs font-medium uppercase tracking-wide ${text} opacity-80`}>{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}