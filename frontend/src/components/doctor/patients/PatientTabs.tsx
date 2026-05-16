'use client';

interface PatientTabsProps {
  activeTab: 'historial' | 'consulta';
  onTabChange: (tab: 'historial' | 'consulta') => void;
  isActivePatient: boolean;
}

export default function PatientTabs({ activeTab, onTabChange, isActivePatient }: PatientTabsProps) {
  return (
    <div className="flex border-b border-gray-200 bg-white px-6">
      <button
        onClick={() => onTabChange('historial')}
        className={`px-5 py-3 text-sm font-medium transition-colors ${
          activeTab === 'historial'
            ? 'border-b-2 border-indigo-600 text-indigo-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Historial
      </button>

      <button
        onClick={() => isActivePatient && onTabChange('consulta')}
        disabled={!isActivePatient}
        className={`px-5 py-3 text-sm font-medium transition-colors ${
          !isActivePatient
            ? 'cursor-not-allowed text-gray-300'
            : activeTab === 'consulta'
              ? 'border-b-2 border-indigo-600 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Consulta Actual
      </button>
    </div>
  );
}
