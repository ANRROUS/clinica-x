'use client';

import type { MetricasDashboardDTO } from '@/lib/api/types';

interface MetricCardsProps {
  metrics: MetricasDashboardDTO;
}

const cards = [
  { key: 'totalDoctors' as const, label: 'TOTAL MEDICOS', numberColor: '#008585' },
  { key: 'activeDoctors' as const, label: 'ACTIVOS', numberColor: '#4CAF50' },
  { key: 'inactiveDoctors' as const, label: 'INACTIVO', numberColor: '#F44336' },
  { key: 'totalSpecialties' as const, label: 'ESPECIALIDADES', numberColor: '#673AB7' },
];

export default function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map(({ key, label, numberColor }) => (
        <div
          key={key}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div
            className="py-3 text-center text-xs font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: '#008585' }}
          >
            {label}
          </div>
          <div className="flex h-[88px] items-center justify-center">
            <span
              className="text-5xl font-bold"
              style={{ color: numberColor }}
            >
              {metrics[key]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}