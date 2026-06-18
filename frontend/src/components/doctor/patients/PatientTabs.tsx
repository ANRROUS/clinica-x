'use client';

import { PatientTabsSkeleton } from '@/components/shared/Skeleton';

interface PatientTabsProps {
  activeTab: 'historial' | 'consulta';
  onTabChange: (tab: 'historial' | 'consulta') => void;
  isActivePatient: boolean;
  isLoading?: boolean;
}

export default function PatientTabs({ activeTab, onTabChange, isActivePatient, isLoading = false }: PatientTabsProps) {
  if (isLoading) {
    return <PatientTabsSkeleton />;
  }

  return (
    <div className="flex bg-white px-6 py-3 gap-2">
      <button
        onClick={() => onTabChange('historial')}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
          activeTab === 'historial'
            ? 'bg-brand-500 text-white'
            : 'border border-gray-300 text-gray-600 hover:border-brand-500 hover:text-brand-500'
        }`}
      >
        Historial
      </button>

      <button
        onClick={() => isActivePatient && onTabChange('consulta')}
        disabled={!isActivePatient}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
          !isActivePatient
            ? 'cursor-not-allowed border border-gray-200 text-gray-300'
            : activeTab === 'consulta'
              ? 'bg-brand-500 text-white'
              : 'border border-gray-300 text-gray-600 hover:border-brand-500 hover:text-brand-500'
        }`}
      >
        Consulta Actual
      </button>
    </div>
  );
}
