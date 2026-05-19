'use client';

type TabKey = 'consultas' | 'tratamiento' | 'reservas';

interface Props {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'consultas', label: 'Consultas' },
  { key: 'tratamiento', label: 'Tratamiento' },
  { key: 'reservas', label: 'Reservas' },
];

export default function ProfileTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`min-w-[160px] rounded-lg border-2 px-8 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'border-[#008585] bg-[#008585] text-white'
                : 'border-[#008585] bg-white text-[#008585] hover:bg-[#008585]/5'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
