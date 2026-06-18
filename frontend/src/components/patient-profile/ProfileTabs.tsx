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
    <nav className="flex flex-col gap-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold transition ${
              isActive
                ? 'border-[#008585] bg-[#008585] text-white'
                : 'border-[#008585] bg-white text-[#008585] hover:bg-[#008585]/5'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
