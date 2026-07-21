'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ManualSection } from '@/data/manualData';
import ManualSidebar from './ManualSidebar';
import ManualContent from './ManualContent';
import { X } from 'lucide-react';

interface ManualModalProps {
  sections: ManualSection[];
  isOpen: boolean;
  onClose: () => void;
  roleLabel: string;
}

export default function ManualModal({ sections, isOpen, onClose, roleLabel }: ManualModalProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections.length > 0 ? sections[0].id : ''
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      if (sections.length > 0) {
        setActiveSection(sections[0].id);
      }
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, sections, handleKeyDown]);

  useEffect(() => {
    if (sections.length > 0) {
      setActiveSection(sections[0].id);
    }
  }, [sections]);

  if (!isOpen) return null;

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#003F86]">Manual de Usuario</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {roleLabel}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Cerrar manual"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ManualSidebar
          sections={sections}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          roleLabel={roleLabel}
        />
        {currentSection && (
          <ManualContent
            section={currentSection}
            sections={sections}
            activeSection={activeSection}
            onSelectSection={setActiveSection}
          />
        )}
      </div>
    </div>
  );
}
