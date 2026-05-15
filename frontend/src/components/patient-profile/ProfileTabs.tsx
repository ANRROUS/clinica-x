'use client';

import { useState } from 'react';

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
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-6 py-3 text-sm font-medium transition ${
            activeTab === tab.key
              ? 'border-b-2 border-brand-500 text-brand-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}