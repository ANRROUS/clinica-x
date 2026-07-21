'use client';

import type { ManualSection } from '@/data/manualData';
import { ChevronRight } from 'lucide-react';

interface ManualSidebarProps {
  sections: ManualSection[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  roleLabel: string;
}

export default function ManualSidebar({
  sections,
  activeSection,
  onSelectSection,
  roleLabel,
}: ManualSidebarProps) {
  return (
    <aside className="hidden md:flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50/80">
      <div className="border-b border-gray-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Manual de Usuario
        </p>
        <p className="mt-1 text-sm font-medium text-[#003F86]">{roleLabel}</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-1">
          {sections.map((section) => {
            const isActive = section.id === activeSection;
            return (
              <li key={section.id}>
                <button
                  onClick={() => onSelectSection(section.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? 'bg-[#008585] text-white font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-200/70'
                  }`}
                >
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                  <span className="line-clamp-2">{section.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
